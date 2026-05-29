import json
from typing import AsyncGenerator, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.faq import FAQ
from ..ai.rag_pipeline import RAGPipeline
from ..ai.deepseek_client import chat_stream
from ..core.cache import cache_get, cache_set

SENSITIVE_KEYWORDS = ["政治", "政府", "抗议", "示威"]


class ChatService:
    """AI客服服务：FAQ→RAG→DeepSeek 三级管道"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.rag = RAGPipeline()

    def _filter_sensitive(self, message: str) -> bool:
        for kw in SENSITIVE_KEYWORDS:
            if kw in message:
                return True
        return False

    async def answer(self, message: str, history: List[dict] | None = None) -> AsyncGenerator[str, None]:
        # Stage 0: 政敏过滤
        if self._filter_sensitive(message):
            yield json.dumps({"type": "error", "content": "抱歉，该问题不在我的服务范围内，请咨询人工客服。"}, ensure_ascii=False)
            return

        # Stage 1: 精确FAQ匹配
        cache_key = f"faq:{message.strip()}"
        cached = await cache_get(cache_key)
        if cached:
            yield json.dumps({"type": "chunk", "content": cached}, ensure_ascii=False)
            yield json.dumps({"type": "done", "source": "faq_cache"}, ensure_ascii=False)
            return

        result = await self.db.execute(select(FAQ).where(FAQ.question.ilike(f"%{message.strip()}%"), FAQ.is_active.is_(True)))
        faq = result.scalar_one_or_none()
        if faq:
            await cache_set(cache_key, faq.answer, ttl=86400)
            yield json.dumps({"type": "chunk", "content": faq.answer}, ensure_ascii=False)
            yield json.dumps({"type": "done", "source": "faq"}, ensure_ascii=False)
            return

        # Stage 2: RAG + DeepSeek
        rag_result = await self.rag.answer(message)
        if rag_result.get("confidence", 0) >= 0.5:
            yield json.dumps({"type": "chunk", "content": rag_result["answer"]}, ensure_ascii=False)
            yield json.dumps({"type": "done", "source": "rag"}, ensure_ascii=False)
            return

        # Stage 3: Fallback
        yield json.dumps({"type": "chunk", "content": "抱歉，我暂时无法回答这个问题。请输入「人工」转接人工客服。"}, ensure_ascii=False)
        yield json.dumps({"type": "done", "source": "fallback"}, ensure_ascii=False)

    async def chat_stream_response(self, message: str) -> AsyncGenerator[str, None]:
        """SSE流式调用DeepSeek"""
        if self._filter_sensitive(message):
            yield f"data: {json.dumps({'type': 'error', 'content': '抱歉，该问题不在我的服务范围内。'}, ensure_ascii=False)}\n\n"
            yield "data: [DONE]\n\n"
            return

        messages = [
            {"role": "system", "content": "你是小扬同学，澳门直播协会的AI助手。请用简体中文回答，语气友好专业。"},
            {"role": "user", "content": message}
        ]
        try:
            async for chunk in chat_stream(messages):
                yield f"data: {json.dumps({'type': 'chunk', 'content': chunk}, ensure_ascii=False)}\n\n"
        except Exception:
            yield f"data: {json.dumps({'type': 'error', 'content': 'AI服务暂时不可用'}, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"
