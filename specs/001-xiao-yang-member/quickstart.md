# Quickstart: 小扬同学 - AI会员管理助手

**Feature**: 001-xiao-yang-member | **Date**: 2026-05-14

## Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- DeepSeek API Key
- WeChat Mini Program AppID + AppSecret
- Node.js 18+ (for mini-program dev tools)

## Backend Setup

```bash
# 1. Clone & enter project
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your values:
#   DATABASE_URL=postgresql://user:pass@localhost:5432/xiaoyang
#   REDIS_URL=redis://localhost:6379/0
#   DEEPSEEK_API_KEY=sk-xxxxx
#   WECHAT_APPID=wxXXXX
#   WECHAT_SECRET=xxxxx
#   JWT_SECRET=your-secret-key

# 5. Run migrations
alembic upgrade head

# 6. Seed FAQ knowledge base
python scripts/seed_faq.py

# 7. Start dev server
uvicorn src.main:app --reload --port 8000
```

## Verify Backend

```bash
# Health check
curl http://localhost:8000/health

# API docs (auto-generated)
open http://localhost:8000/docs

# Run tests
pytest tests/ -v
```

## Frontend (WeChat Mini Program)

```bash
cd frontend-miniprogram

# 1. Install WeChat DevTools
# Download: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

# 2. Configure app.js
# Edit config to point to backend API base URL

# 3. Open project in WeChat DevTools
# Import project directory, set AppID

# 4. Preview on device
# Click "Preview" in DevTools, scan QR code
```

## Key User Flows to Test

1. **入会流程**: 微信登录 → 咨询入会条件 → 填表提交 → 初審 → 上传凭证 → 入会成功
2. **咨询流程**: 提问入会条件 → RAG 回答 → 复杂问题转人工
3. **等级查询**: 登录 → 查看等级 → 查看当前等级与年费
4. **活动报名**: 浏览活动 → 报名 → 取消报名
5. **通知**: 小程序订阅消息 (C端) + Web H5 站内通知中心 (B端)

## Directory Map

```
backend/src/
├── main.py              # FastAPI app entry
├── core/
│   ├── config.py        # Settings from env
│   ├── security.py      # JWT, auth deps
│   └── database.py      # SQLAlchemy engine
├── models/
│   ├── member.py
│   ├── application.py
│   ├── event.py
│   ├── notification.py
│   └── faq.py
├── services/
│   ├── chat_service.py      # AI/RAG orchestration
│   ├── member_service.py    # CRUD + tier + fee management
│   ├── screening_service.py # Application screening
│   ├── event_service.py
│   └── notification_service.py
├── api/
│   ├── auth.py
│   ├── chat.py
│   ├── applications.py
│   ├── members.py
│   ├── events.py
│   ├── constitution_rules.py  # ConstitutionRules CRUD
│   └── notifications.py
├── ai/
│   ├── deepseek_client.py   # DeepSeek API wrapper
│   ├── rag_pipeline.py      # LangChain RAG
│   └── knowledge_base.py    # Chroma management
└── scripts/
    ├── seed_faq.py          # Initial FAQ seeding
    └── seed_root.py        # Seed root 理事
```