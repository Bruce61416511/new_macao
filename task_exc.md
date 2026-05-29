# 小扬同学 任务执行说明

## 进度记录机制

核心记录方式：直接修改 `specs/001-xiao-yang-member/tasks.md` 中的 checkbox。

- task 执行成功 -> `- [x]`
- task 未执行或中断 -> `- [ ]`（保持不变）

没有额外的数据库或状态文件，`tasks.md` 本身就是唯一的进度账本。

## 中断处理

| 场景 | tasks.md 状态 | 重跑行为 |
|------|:--:|------|
| Phase 全部完成，下一 Phase 未开始 | 已完成 task `[x]` | 跳过已完成 Phase，从下一个开始 |
| 某个 task 写到一半中断 | 该 task 仍是 `[ ]` | 重新执行该 task（增量补齐，不删文件） |
| task 写完但后续未写 | 该 task `[x]`, 后续 `[ ]` | 跳过已完成 task，从下一个继续 |

关键原则：speckit 没有删掉重写机制，重跑是增量补齐。

## 分阶段执行方案

### 阶段一：地基（Phase 1 + 2）— 13 个 task

> 跑通基础设施，还没业务功能但骨架已就位

Phase 1: T001-T005 → 项目脚手架、依赖、配置
Phase 2: T006-T013 → 数据库、认证、FastAPI、Redis、向量库、DeepSeek客户端

产出：FastAPI 能启动、数据库能连、AI 客户端就绪。

### 阶段二：MVP 入会流程（Phase 3）— 14 个 task 🎯

> 第一个可用的业务闭环

Phase 3: T014-T025a → 入会申请全流程

产出：新会员从咨询→填表→初审→终审→缴费→入会，端到端跑通。

### 阶段三：AI 问答 + 资料管理（Phase 4 + 5）— 15 个 task

Phase 4: T026-T033 → AI 咨询问答（FAQ→RAG→DeepSeek 三级管道）
Phase 5: T034-T040 → 会员资料 CRUD + 隐私脱敏

产出：小扬同学能聊天了，会员能查/改自己的资料，管理后台能搜索。

### 阶段四：活动 + 等级（Phase 6 + 7）— 12 个 task

Phase 6: T041-T046 → 活动发布 + 报名 + 通知
Phase 7: T047-T050a → 等级管理 + 年费

产出：活动模块和等级体系上线。

### 阶段五：收尾（Phase 8）— 8 个 task

Phase 8: T051-T056a → 限流、校验加固、前端页面壳、缓存优化、全量测试

产出：生产就绪的完整系统。

## 一图总结

```
阶段一 (13) ──→ 阶段二 MVP (14) ──→ 阶段三 (15) ──→ 阶段四 (12) ──→ 阶段五 (8)
  地基           入会闭环           AI问答+资料        活动+等级          打磨上线
```

## 完整 Task 清单

### Phase 1: Setup（项目初始化）

| ID | 类型 | 中文描述 |
|----|:--:|------|
| T001 | 开发 | 创建 backend/ 和 frontend-miniprogram/ 目录结构 |
| T002 | 开发 | 初始化 Python 项目，配置 FastAPI 依赖 requirements.txt |
| T003 | 开发 | 配置 ruff(代码检查) + black(格式化) |
| T004 | 开发 | 创建 .env.example 环境变量模板 |
| T005 | 开发 | 初始化微信小程序项目骨架 frontend-miniprogram/ |

### Phase 2: Foundational（核心基础设施）

| ID | 类型 | 中文描述 |
|----|:--:|------|
| T006 | 开发 | 搭建 PostgreSQL 连接 + SQLAlchemy ORM + Alembic 数据库迁移 |
| T007 | 开发 | 实现 JWT 认证 + 微信小程序登录接口 wx.login |
| T008 | 开发 | 初始化 FastAPI 应用，配置 CORS、中间件、异常处理 |
| T009 | 开发 | 结构化日志 + 全局异常捕获 |
| T010 | 开发 | 创建 Member 基础数据模型（含 username/id_number 唯一不可变字段） |
| T011 | 开发 | 搭建 Redis 连接 + 缓存工具 |
| T012 | 开发 | 搭建 Chroma 向量数据库 + embedding 嵌入管道 |
| T013 | 开发 | 封装 DeepSeek API 客户端（支持流式输出） |

### Phase 3: US1 - 新会员入会申请 MVP

| ID | 类型 | 中文描述 |
|----|:--:|------|
| T014 | 测试 | Contract 测试：POST /applications + GET /applications/{id} |
| T015 | 测试 | 集成测试：完整入会流程（提交→初审→终审→缴费→确认） |
| T016 | 开发 | 创建 Application 申请表数据模型 |
| T017 | 开发 | 创建 ConstitutionRules 章程规则模型（JSONB 存储规则） |
| T017a | 开发 | 实现章程规则 CRUD API（行政同事管理入会规则） |
| T018 | 开发 | 实现 ScreeningService 自动化初审服务（章程规则驱动） |
| T019 | 开发 | 实现 ApplicationService（CRUD + 状态流转 + 重复检测） |
| T020 | 开发 | 实现 POST /applications 提交申请表+校验 |
| T021 | 开发 | 实现 GET /applications/{id} + GET /applications 列表查询 |
| T022 | 开发 | 实现 POST /applications/{id}/screening AI初审回调 |
| T023 | 开发 | 实现 POST /applications/{id}/final-review 理事终审 |
| T023a | 开发 | Web H5 终审审批页面（理事端） |
| T024 | 开发 | 实现 POST /applications/{id}/payment-proof 上传缴费凭证 |
| T024a | 开发 | Web H5 缴费审核页面（理事端） |
| T025 | 开发 | 实现 POST /applications/{id}/verify-payment 确认缴费→创建正式会员 |
| T025a | 开发 | 实现终审超时升级机制（24h 超时自动催办理事） |

### Phase 4: US2 - AI会员咨询服务

| ID | 类型 | 中文描述 |
|----|:--:|------|
| T026 | 测试 | Contract 测试：POST /chat |
| T027 | 测试 | 集成测试：FAQ→RAG→DeepSeek 三级问答管道 + 升级流程 |
| T028 | 开发 | 实现 ChatService（FAQ→RAG→DeepSeek 三级管道） |
| T029 | 开发 | 实现 POST /chat 端点（SSE 流式输出） |
| T030 | 开发 | 知识库 FAQ 种子数据加载器 |
| T031 | 开发 | 实现 GET /faq 端点 + 模糊搜索 |
| T032 | 开发 | 实现理事升级端点 POST /chat/escalate |
| T033 | 开发 | 会话上下文管理（Redis session） |

### Phase 5: US3 - 会员资料管理

| ID | 类型 | 中文描述 |
|----|:--:|------|
| T034 | 测试 | Contract 测试：GET/PATCH /members/me |
| T035 | 测试 | 集成测试：会员 CRUD + 隐私字段脱敏 |
| T036 | 开发 | 实现 MemberService（查询、更新、删除） |
| T037 | 开发 | 实现 GET /members/me + PATCH /members/me 端点 |
| T038 | 开发 | 隐私字段脱敏中间件（身份证/手机号部分掩码） |
| T039 | 开发 | 实现 GET /members/search 行政同事搜索 |
| T040 | 开发 | 实现 DELETE /members/{id} + 数据保留规则 |

### Phase 6: US4 - 活动管理与通知

| ID | 类型 | 中文描述 |
|----|:--:|------|
| T041 | 测试 | Contract 测试：POST/GET /events |
| T042 | 测试 | 集成测试：活动 CRUD + 报名 + 通知 |
| T043 | 开发 | 创建 Event 模型 + EventService |
| T044 | 开发 | 实现 POST /events + GET /events 端点 |
| T045 | 开发 | 实现 EventRegistrationService（报名+取消+人数上限） |
| T046 | 开发 | 实现 NotificationService（站内信+微信模板消息） |

### Phase 7: US5 - 会员等级管理

| ID | 类型 | 中文描述 |
|----|:--:|------|
| T047 | 开发 | 等级规则模型 + 默认等级定义 |
| T048 | 开发 | 种子数据：首次部署时创建 root 理事账号 |
| T049 | 开发 | 实现 PATCH /members/{id}/tier 行政同事手动修改等级+年费 |
| T050 | 开发 | 实现 GET /members/me/tier 返回当前等级+年费 |
| T050a | 开发 | root 可后台手动增减理事 |

### Phase 8: Polish（打磨收尾）

| ID | 类型 | 中文描述 |
|----|:--:|------|
| T051 | 开发 | 限流中间件（每日200次、并发50上限） |
| T052 | 开发 | 输入校验强化（手机格式、XSS防护、文件上传限制） |
| T053 | 开发 | 微信小程序聊天页面外壳 |
| T054 | 开发 | 微信小程序入会申请表页面 |
| T054a | 开发 | Web H5 聊天页面 |
| T054b | 开发 | Web H5 入会申请表页面 |
| T054c | 开发 | 会员个人中心（小程序+Web 双端） |
| T055 | 测试 | 运行全量集成测试 pytest backend/tests/ -v |
| T056 | 开发 | FAQ 回复 Redis 缓存优化 |
| T056a | 开发 | 系统更新通知推送（FR-018） |

**总计：56 个 task | 9 个测试 + 47 个开发**
