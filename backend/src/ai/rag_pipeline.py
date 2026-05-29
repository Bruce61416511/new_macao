from typing import List

from .knowledge_base import get_faq_collection, search
from .deepseek_client import chat


class RAGPipeline:
    """RAG流水线：检索FAQ知识库 + DeepSeek生成回答"""

    SYSTEM_PROMPT = """你是小扬同学，澳门直播协会的AI助手。请根据以下知识库内容回答会员的问题。
如果知识库中没有相关信息，请诚实告知并建议转接人工客服。
请用简体中文回答，语气友好专业。"""

    def __init__(self):
        self.collection = get_faq_collection()

    async def answer(self, question: str) -> dict:
        documents = search(self.collection, question, n_results=3)
        if not documents:
            return {"answer": "抱歉，我暂时无法回答这个问题。我可以帮您转接人工客服。", "source": "fallback", "confidence": 0.0}

        context = "\n\n".join(documents)
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user", "content": f"知识库内容：\n{context}\n\n用户问题：{question}"}
        ]
        try:
            answer = await chat(messages, temperature=0.3, max_tokens=1024)
            return {"answer": answer, "source": "rag", "confidence": 0.85}
        except Exception:
            # Fallback to simple FAQ match
            return {"answer": documents[0], "source": "faq_match", "confidence": 0.7}
