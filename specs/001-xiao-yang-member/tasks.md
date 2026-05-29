# Tasks: 小扬同学 - AI会员管理助手

**Input**: Design documents from `/specs/001-xiao-yang-member/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Included per constitution III. Test-First (NON-NEGOTIABLE)

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure per plan.md in backend/ and frontend-miniprogram/
- [x] T002 Initialize Python project with FastAPI dependencies in backend/requirements.txt
- [x] T003 [P] Configure linting (ruff) and formatting (black) in backend/pyproject.toml
- [x] T004 [P] Configure environment management with .env.example in backend/.env.example
- [x] T005 [P] Initialize WeChat Mini Program project structure in frontend-miniprogram/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

⚠️ **CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Setup PostgreSQL connection + SQLAlchemy + Alembic migrations in backend/src/core/database.py and backend/alembic/
- [x] T007 [P] Implement JWT authentication with wx.login in backend/src/core/security.py and backend/src/api/auth.py
- [x] T008 [P] Setup FastAPI app with CORS, middleware, error handlers in backend/src/main.py
- [x] T009 [P] Configure structured logging and global exception handling in backend/src/core/logging.py
- [x] T010 [P] Create Member base model (含 username/id_number 唯一不可变字段) in backend/src/models/member.py
- [x] T011 Setup Redis connection and caching utilities in backend/src/core/cache.py
- [x] T012 [P] Setup Chroma vector DB and embedding pipeline in backend/src/ai/knowledge_base.py
- [x] T013 [P] Create DeepSeek API client wrapper with streaming support in backend/src/ai/deepseek_client.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 新会员入会申请 (Priority: P1) 🎯 MVP

**Goal**: 新申请人完成从咨询→填表→初審→终審→上传缴费凭证→入会确认的完整流程

**Independent Test**: 模拟一位新申请人完成完整入会流程，验证每个状态转换正确

### Tests for User Story 1 ⚠️

> **Write these tests FIRST, ensure they FAIL before implementation**

- [x] T014 [P] [US1] Contract test for POST /applications and GET /applications/{id} in backend/tests/contract/test_applications.py
- [x] T015 [P] [US1] Integration test for full application flow (submit→screen→review→pay→confirm) in backend/tests/integration/test_application_flow.py

### Implementation for User Story 1

- [x] T016 [P] [US1] Create Application model (含 username/id_number 唯一不可变字段) in backend/src/models/application.py
- [x] T017 [P] [US1] Create ConstitutionRules model (JSONB rule storage) in backend/src/models/constitution_rules.py
- [x] T017a [US1] Implement ConstitutionRules CRUD API (行政同事管理章程规则) in backend/src/api/constitution_rules.py
- [x] T018 [US1] Implement ScreeningService (章程规则驱动的自动化初審) in backend/src/services/screening_service.py
- [x] T019 [US1] Implement ApplicationService (CRUD + state transitions + duplicate detection) in backend/src/services/application_service.py
- [x] T020 [US1] Implement POST /applications endpoint (form submission + validation) in backend/src/api/applications.py
- [x] T021 [US1] Implement GET /applications/{id} + GET /applications (staff list) in backend/src/api/applications.py
- [x] T022 [US1] Implement POST /applications/{id}/screening (AI初審回调) in backend/src/api/applications.py
- [x] T023 [US1] Implement POST /applications/{id}/final-review (root理事终審) in backend/src/api/applications.py
- [x] T023a [P] [US1] Create Web H5 终審审批页面 (root理事: 待审列表、查看申请、通过/驳回+理由) in frontend-web/pages/board/review/
- [x] T024 [US1] Implement POST /applications/{id}/payment-proof (凭证上传+存档) in backend/src/api/applications.py
- [x] T024a [P] [US1] Create Web H5 缴费审核页面 (root理事: 待审核凭证列表、查看截图、确认/退回) in frontend-web/pages/staff/payment-verify/
- [x] T025 [US1] Implement POST /applications/{id}/verify-payment (root确认缴费→创建Member) in backend/src/api/applications.py

**Checkpoint**: User Story 1 独立可测 — 完整入会流程端到端通过

- [x] T025a [US1] Implement 终審 timeout escalation (24h超时自动催办 root) in backend/src/services/application_service.py
- [x] T025b [US1] Implement缴费确认 timeout escalation (3天催办 root, 7天升级行政同事) in backend/src/services/application_service.py
- [x] T025c [P] [US1] Implement notification dispatch: 小程序订阅消息 (C端) + Web H5 站内通知 (B端) (FR-010b) in backend/src/services/notification_service.py
- [x] T025d [US1] Implement驳回理由/重申请 resubmission workflow (初審+终審不通过) in backend/src/services/application_service.py
- [x] T025e [P] [US1] Create 申请进度追踪页 (状态条/驳回理由/缴费指引+倒计时/凭证上传入口/重传入口) in frontend-miniprogram/pages/application/track/ and frontend-web/pages/application/track/
- [x] T025f [P] [US1] Create 驳回重申请流程UI (保留原表单数据/显示驳回理由/修改后重新提交) in frontend-miniprogram/pages/application/resubmit/ and frontend-web/pages/application/resubmit/

---

## Phase 4: User Story 2 - 会员咨询服务 (Priority: P1)

**Goal**: AI 驱动的 FAQ 问答 + 智能转接人工；知识库可维护

**Independent Test**: 提问标准FAQ→验证RAG准确回复；提问复杂问题→验证转接人工机制

### Tests for User Story 2 ⚠️

- [x] T026 [P] [US2] Contract test for POST /chat/message (SSE) and GET /chat/history in backend/tests/contract/test_chat.py

### Implementation for User Story 2

- [x] T027 [P] [US2] Create FAQ model + seed script (澳门直播协会常见问答) in backend/src/models/faq.py and backend/src/scripts/seed_faq.py
- [x] T028 [US2] Implement RAG pipeline (LangChain: embed→Chroma retrieve→context→DeepSeek generate) in backend/src/ai/rag_pipeline.py
- [x] T029 [US2] Implement ChatService (意图分类: FAQ命中→RAG / 复杂问题→转人工) in backend/src/services/chat_service.py
- [x] T030 [US2] Implement POST /chat/message (SSE streaming response) in backend/src/api/chat.py
- [x] T031 [US2] Implement GET /chat/history (对话历史分页) in backend/src/api/chat.py
- [x] T032 [US2] Implement human handoff logic (低相似度 → 标记待处理 → 通知行政同事) in backend/src/services/chat_service.py
- [x] T033 [US2] Implement FAQ CRUD management endpoints (staff) in backend/src/api/chat.py

**Checkpoint**: User Story 2 独立可测 — FAQ 问答准确，复杂问题正确转接

- [x] T033a [US2] Implement AI reply feedback mechanism (thumb up/down + admin review trigger) in backend/src/api/chat.py
- [x] T033b [US2] Implement content safety guard (AI判断违规→拒绝回复+记录日志) in backend/src/services/chat_service.py
- [x] T033c [US2] Implement human handoff escalation (24h超时催办, 48h升级 root) in backend/src/services/chat_service.py

---

## Phase 5: User Story 3 - 会员资料管理与查询 (Priority: P2)

**Goal**: 会员自助查询/更新个人资料；行政同事全量管理+批量导出；RBAC 权限控制

**Independent Test**: 会员查询自己资料→更新成功；行政同事查看所有会员→批量导出CSV；会员越权被拒绝

### Tests for User Story 3 ⚠️

- [x] T034 [P] [US3] Contract test for GET/PATCH /members/me and staff member endpoints in backend/tests/contract/test_members.py

### Implementation for User Story 3

- [x] T035 [P] [US3] Implement RBAC middleware (role claims → member/staff/board access control per FR-019) in backend/src/core/security.py
- [x] T036 [US3] Implement GET /members/me + PATCH /members/me (会员自助) in backend/src/api/members.py
- [x] T037 [US3] Implement staff endpoints: GET /members, GET /members/{id}, PATCH /members/{id} in backend/src/api/members.py
- [x] T038 [US3] Implement GET /members/export (CSV 批量导出) in backend/src/api/members.py
- [x] T039 [US3] Add audit logging for member data changes (who changed what when) in backend/src/services/member_service.py

**Checkpoint**: User Story 3 独立可测 — 权限分级正确，CRUD + 导出功能完整

- [x] T039a [US3] Implement membership status auto-update (会费到期→过期, 续费→恢复) in backend/src/services/member_service.py
- [x] T039c [US3] Implement permission boundary enforcement (越权访问→友好提示+日志) in backend/src/core/security.py
- [x] T039d [P] [US3] Create Web H5 会员管理后台页面 (行政同事: 搜索、查看详情、编辑、导出CSV) in frontend-web/pages/staff/members/
- [x] T039e [P] [US1] Create Web H5 章程规则管理页面 (行政同事: 规则增删改、版本管理) in frontend-web/pages/staff/constitution-rules/

---

## Phase 6: User Story 4 - 会员活动与通知 (Priority: P2)

**Goal**: 行政创建/编辑/取消活动（含普通价+高级折扣价）；会员浏览/报名/取消；名额满自动关闭；活动取消自动通知已报名会员

**Independent Test**: 行政创建活动→群发通知→会员报名→名额满→会员取消→活动取消通知

### Tests for User Story 4 ⚠️

- [x] T040 [P] [US4] Contract test for event and notification endpoints in backend/tests/contract/test_events_notifications.py

### Implementation for User Story 4

- [x] T041 [P] [US4] Create Event and EventRegistration models in backend/src/models/event.py
- [x] T042 [P] [US4] Create Notification model in backend/src/models/notification.py
- [x] T043 [US4] Implement EventService + endpoints (CRUD, register, cancel, capacity check) in backend/src/services/event_service.py and backend/src/api/events.py
- [x] T044 [US4] Implement NotificationService + endpoints (send, list, unread count) in backend/src/services/notification_service.py and backend/src/api/notifications.py
- [x] T045 [US4] Implement scheduled notification jobs: 会费到期前7天提醒 + 活动通知 in backend/src/services/notification_service.py

**Checkpoint**: User Story 4 独立可测 — 活动全流程 + 通知自动触发

- [x] T045a [US4] Implement C端小程序订阅消息 + B端站内通知 + 通知收件箱沉淀 in backend/src/services/notification_service.py
- [x] T045b [US4] Implement event cancellation/change manual mass notification in backend/src/api/events.py
- [x] T045c [P] [US4] Create Web H5 通知发送页面 (行政同事: 按等级/状态筛选会员、群发通知) in frontend-web/pages/staff/notifications/
- [x] T045d [P] [US4] Create Web H5 活动管理页面 (行政同事: 创建/编辑/取消活动，查看报名名单) in frontend-web/pages/staff/events/
- [x] T045e [P] [US4] Create 小程序/Web H5 活动列表+详情+报名页面 (会员: 浏览活动、查看详情、报名/取消) in frontend-miniprogram/pages/events/ and frontend-web/pages/member/events/

---

## Phase 7: User Story 5 - 会员等级管理 (Priority: P3)

**Goal**: 三级等级（普通500/年、高级2000/年含活动8折、理事可后台增加），行政同事手动管理等级变更，root为默认理事

**Independent Test**: 初始化root理事 → 行政改会员等级 → 会员端查看等级+年费

### Tests for User Story 5 ⚠️

- [x] T046 [P] [US5] Contract test for tier endpoint in backend/tests/contract/test_tier.py

### Implementation for User Story 5

- [x] T047 [US5] Add annual_fee + is_board fields to Member model + migration (annual_fee: 普通=500/高级=2000/理事=0, is_board: 理事=TRUE) in backend/src/models/member.py
- [x] T048 [US5] Implement seed script: create root 理事 (name='root', tier='理事', annual_fee=0) on first deploy in backend/src/core/seed.py
- [x] T049 [US5] Implement PATCH /members/{id}/tier (行政同事手动修改等级+年费) in backend/src/api/members.py
- [x] T050 [US5] Implement GET /members/me/tier (返回当前等级+年费金额)
- [x] T050a [US5] Implement root can manage 理事 (root可后台手动增减理事) in backend/src/api/members.py

**Checkpoint**: User Story 5 独立可测 — 等级手动管理运转
## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T051 [P] Rate limiting middleware (per FR: 200 daily, 50 concurrent) in backend/src/core/middleware.py
- [x] T052 [P] Input validation hardening (phone format, XSS防护, file upload limits) in backend/src/core/validation.py
- [x] T053 [P] Create WeChat Mini Program chat page shell (基础聊天界面) in frontend-miniprogram/pages/index/
- [x] T054 [P] Create WeChat Mini Program application form page in frontend-miniprogram/pages/application/
- [x] T054a [P] Create Web H5 chat page (协会官网嵌入) in frontend-web/src/pages/chat/
- [x] T054b [P] Create Web H5 application form page in frontend-web/src/pages/application/
- [x] T054c [P] Create 会员个人中心 (资料查看编辑/等级+年费/活动报名/通知收件箱) in frontend-miniprogram/pages/center/ and frontend-web/pages/member/center/
- [x] T055 Run full integration test suite (pytest backend/tests/ -v) per quickstart.md scenarios
- [x] T056 [P] Performance optimization: add Redis caching for FAQ responses in backend/src/services/chat_service.py 
- [x] T056a [P] Implement system update notification dispatch (FR-018) in backend/src/services/notification_service.py

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — MVP! 🎯
- **US2 (Phase 4)**: Depends on Foundational — can run parallel with US1
- **US3 (Phase 5)**: Depends on Foundational — can run parallel with US1/US2
- **US4 (Phase 6)**: Depends on Foundational — can run parallel with US1-US3
- **US5 (Phase 7)**: Depends on Foundational + US3 (Member data needed)
- **Polish (Phase 8)**: Depends on all desired stories complete

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models → Services → Endpoints → Integration
- Core implementation before integration

### Parallel Opportunities

- All [P] tasks within a phase can run in parallel
- US1 and US2 can be developed in parallel after Foundational
- US3 and US4 can be developed in parallel after Foundational
- All contract tests marked [P] within a story can run in parallel

---

## Parallel Example: User Story 1

```bash
# Step 1: Launch all tests together (must FAIL first):
Task: "T014 Contract test for POST /applications in backend/tests/contract/test_applications.py"
Task: "T015 Integration test for full application flow in backend/tests/integration/test_application_flow.py"

# Step 2: Launch all models together:
Task: "T016 Create Application model in backend/src/models/application.py"
Task: "T017 Create ConstitutionRules model in backend/src/models/constitution_rules.py"

# Step 3: Services (sequential due to dependencies)
# Step 4: Endpoints (can parallelize by endpoint file)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: 端到端入会流程通过
5. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational → 基础设施就绪
2. Add US1 → 入会流程可用 → **Deploy MVP** 🎯
3. Add US2 → AI 问答上线 → Deploy
4. Add US3 → 会员资料管理 → Deploy
5. Add US4 → 活动+通知 → Deploy
6. Add US5 → 等级+分析 → Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (入会申请)
   - Developer B: US2 (咨询服务)
   - Developer C: US3 (资料管理)
3. Then:
   - Developer A: US4 (活动通知)
   - Developer B: US5 (等级管理)
   - Developer C: Polish

---

## Notes

- [P] tasks = different files, no dependencies — safe to parallelize
- [Story] label maps task to specific user story for traceability (US1-US5)
- Each user story is independently completable and testable
- Verify tests FAIL before implementing (Red-Green-Refactor per constitution III)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to repository root
- Backend paths: `backend/`; Mini Program paths: `frontend-miniprogram/`
