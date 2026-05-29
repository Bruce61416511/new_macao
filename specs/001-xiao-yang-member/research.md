# Research: 小扬同学 - AI会员管理助手

**Feature**: 001-xiao-yang-member | **Date**: 2026-05-14

## 1. LLM / AI 引擎选型

**Decision**: DeepSeek API (deepseek-chat / deepseek-reasoner)

**Rationale**:
- 项目上下文已使用 DeepSeek 生态（codex+deepseek+speckit），延续性最佳
- DeepSeek 中文能力出色，适合澳门直播协会的中文/粤语会员服务场景
- API 成本可控，支持流式输出（满足聊天体验需求）
- deepseek-reasoner 可用于入会资格评估等需要推理的复杂任务

**Alternatives considered**:
- OpenAI GPT-4o: 中文能力优秀但成本较高，且跨境数据传输合规性存疑
- 百度文心一言: 国内合规性好但生态封闭
- 本地部署 Llama/Qwen: 运维成本高，500-3000 会员规模下 ROI 不足

## 2. 后端框架选型

**Decision**: FastAPI (Python 3.11+)

**Rationale**:
- 异步原生支持，适合 LLM 流式响应场景
- 自动 OpenAPI 文档，便于前后端协作
- Pydantic 数据验证与 spec 中的数据实体定义天然契合
- 生态成熟：SQLAlchemy、Alembic、pytest 无缝集成

**Alternatives considered**:
- Django + DRF: 功能全面但过重，不符合 YAGNI 原则
- Node.js/Express: 团队可能更熟悉，但 AI/NLP 生态 Python 更强

## 3. 数据存储方案

**Decision**: PostgreSQL (主库) + Redis (缓存/会话) + Chroma (向量库)

**Rationale**:
- PostgreSQL: 会员、申请、活动等结构化数据，支持 JSON 字段灵活扩展
- Redis: 会话管理、API 限流、热点数据缓存（会员等级、FAQ 高频问答）
- Chroma: 轻量向量数据库，存储 FAQ 的 embedding（章程规则存 PostgreSQL），驱动 RAG 问答

**Alternatives considered**:
- MySQL: 可用但 JSON 支持不如 PostgreSQL
- Pinecone/Weaviate: 向量库功能更强但引入外部依赖，Chroma 可嵌入 Python 进程

## 4. RAG 知识库架构

**Decision**: LangChain + Chroma 构建 FAQ RAG 流水线

**Rationale**:
- 入会条件、费用标准、会员权益等 FAQ 文档 → Chunk → Embed → Chroma（章程规则本身存 PostgreSQL 的 ConstitutionRules 表，不属于向量库）
- 用户提问 → Embed → Chroma 检索 → 拼接 context → DeepSeek 生成回答
- 支持定期更新 FAQ 知识库（章程变更时重新索引 FAQ）
- 复杂问题无法匹配时自动触发转接人工机制

**Key design**:
- 问题分类器：先判断是否标准问题 → 是则 RAG 回答 → 否则转接行政同事
- Fallback 阈值：相似度 < 0.7 视为超出知识库范围

## 5. 微信小程序集成

**Decision**: 微信小程序原生框架 + wx.login 认证

**Rationale**:
- wx.login 获取 code → 后端换取 openid / unionid → 绑定会员身份
- 聊天界面使用 WebSocket 或 HTTP SSE 实现流式 AI 对话
- 小程序端仅做展示和交互，所有业务逻辑在后端

**Key considerations**:
- 小程序 HTTPS 域名白名单需配置后端 API 地址
- 微信审核注意类目和内容安全接口接入
- Web H5 使用微信公众号 OAuth 或手机号登录

## 6. 缴费凭证上传方案

**Decision**: 后端接收图片 → 对象存储（本地文件系统/S3） → 标记 Application 状态为"待审核缴费" → root 理事后台确认

**Rationale**:
- 无需对接第三方支付，符合 Spec 的 Out of Scope 声明
- 图片存储本地即可满足 500-3000 人规模
- 管理后台提供"待审核缴费"列表，行政同事批量处理

## 7. 认证与权限

**Decision**: JWT (后端) + wx.login (小程序) + 角色声明 (claims)

**Rationale**:
- JWT 无状态，适合 API 横向扩展
- Token 中包含角色（member / staff / root理事），中间件级权限校验
- FR-019 的 RBAC 直接映射为 JWT claims + FastAPI Depends

## 8. 性能与扩展

**Decision**: 当前规模（500→3000 会员，200 日活）无需过度设计

**Rationale**:
- 单实例 FastAPI + PostgreSQL 即可满足需求
- Redis 缓存热点数据（FAQ 响应 < 100ms，无需每次调用 LLM）
- 未来扩展：API → Workers 水平扩展，DB → 读写分离