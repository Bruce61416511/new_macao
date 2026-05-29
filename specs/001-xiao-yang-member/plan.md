# Implementation Plan: 小扬同学 - AI会员管理助手

**Branch**: `001-xiao-yang-member` | **Date**: 2026-05-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-xiao-yang-member/spec.md`

## Summary

构建「小扬同学」AI 会员管理助手，为澳门直播协会提供智能化的会员入会咨询、资料管理、活动通知、等级管理、入会审批等核心功能。技术方案采用 DeepSeek 作为 AI 引擎，FastAPI 构建后端 API，PostgreSQL 存储会员数据，向量数据库支撑知识库问答，通过微信小程序和 Web H5 双渠道触达用户。

## Technical Context

**Language/Version**: Python 3.11+ (backend), JavaScript (WeChat Mini Program / Web H5)

**Primary Dependencies**: FastAPI (backend framework), DeepSeek API (AI/LLM), LangChain (AI orchestration), PostgreSQL (primary DB), Redis (cache/session), Chroma/FAISS (vector DB for knowledge base)

**Storage**: PostgreSQL (members, applications, events, notifications), Redis (session, rate limiting), Chroma (FAQ knowledge base embeddings)

**Testing**: pytest (backend unit + integration), WeChat Mini Program simulator (frontend manual + automated)

**Target Platform**: WeChat Mini Program (primary), Web H5 via association website (secondary)

**Project Type**: web-service (backend API) + mini-program frontend

**Performance Goals**: 200 daily inquiries (avg), 3s response for member queries, 1h initial screening turnaround, support 50 concurrent users

**Constraints**: <3s p95 query response, <1h application screening, GDPR-equivalent data protection (《个人资料保护法》)

**Scale/Scope**: 500 current members → 3,000 target, 200 daily inquiries, 5 user stories (P1-P3)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First | ✅ Pass | spec.md completed and clarified (20+ Q&A resolved (3 sessions)) |
| II. Template-Fidelity | ✅ Pass | Following plan-template.md structure |
| III. Test-First (NON-NEGOTIABLE) | ✅ Pass | Tests will be defined per user story; pytest framework selected |
| IV. Independent Stories | ✅ Pass | 5 user stories (P1-P3), each independently testable and deliverable |
| V. Simplicity & YAGNI | ✅ Pass | Out of scope clearly defined; no premature abstraction; pay via proof upload, not integration |

**Gate Result**: ✅ ALL PASS — Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-xiao-yang-member/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # SQLAlchemy models (Member, Application, Event, etc.)
│   ├── services/        # Business logic (MemberService, ScreeningService, etc.)
│   ├── api/             # FastAPI route handlers
│   ├── ai/              # DeepSeek integration, RAG pipeline, knowledge base
│   └── core/            # Config, security, database connection
├── tests/
│   ├── unit/            # Service-level unit tests
│   ├── integration/     # API endpoint integration tests
│   └── fixtures/        # Test data fixtures
├── alembic/             # Database migrations
├── requirements.txt
└── Dockerfile

frontend-miniprogram/
├── pages/               # WeChat Mini Program pages
│   ├── index/           # Home / chatbot interface
│   ├── application/     # Membership application form
│   ├── profile/         # Member profile & queries
│   ├── events/          # Event browsing & registration
│   └── admin/           # Admin dashboard (staff only)
├── components/          # Reusable UI components
├── services/            # API client wrappers
├── utils/               # Helpers, constants
├── app.js
├── app.json
└── app.wxss

frontend-web/
├── src/
│   ├── components/      # Shared UI components
│   ├── pages/           # Web H5 pages (mirrors mini-program)
│   └── services/        # API client wrappers
└── tests/
```

**Structure Decision**: 采用 backend + dual-frontend 架构。Backend 提供统一 REST API，WeChat Mini Program 为主渠道，Web H5 为辅助渠道。两者共享同一后端 API，前端各自适配平台规范。

## Complexity Tracking

> No violations detected. Constitution Check passed with no justified complexity.