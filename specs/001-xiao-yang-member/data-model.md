# Data Model: 小扬同学 - AI会员管理助手

**Feature**: 001-xiao-yang-member | **Date**: 2026-05-14

## Entity Relationship Diagram

```
Member (1) ──< Application (N)     # 一个会员可有多条历史申请
Member (1) ──< Notification (N)    # 一个会员可收到多条通知
Event  (1) ──< Registration (N) ──> Member (M)  # 活动报名多对多
Member (N) ──< Constitution Rules >── Application  # 章程规则约束入会和等级
```

## Entities

### 1. Member（会员）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | 会员唯一标识 |
| openid | VARCHAR(64) | UNIQUE, NOT NULL | 微信 openid |
| unionid | VARCHAR(64) | UNIQUE, NULLABLE | 微信 unionid（跨平台） |
| name | VARCHAR(50) | NOT NULL | 真实姓名 |
| phone | VARCHAR(20) | NOT NULL | 联系电话 |
| email | VARCHAR(100) | NULLABLE | 邮箱 |
| address | TEXT | NULLABLE | 地址 |
| career_history | TEXT | NULLABLE | 从业经历（JSON/自由文本） |
| qualifications | TEXT | NULLABLE | 相关资质 |
| tier | ENUM | NOT NULL, DEFAULT '普通' | 会员等级：普通/高级/理事 |
| annual_fee | INTEGER | NOT NULL, DEFAULT 500 | 年费金额（普通500/高级2000/理事0） |
| is_board | BOOLEAN | NOT NULL, DEFAULT FALSE | 是否为理事（TRUE可后台增加其他理事） |

| status | ENUM | NOT NULL, DEFAULT '在籍' | 状态：在籍/停用/过期 |
| joined_at | TIMESTAMP | NOT NULL | 入会日期 |
| dues_expire_at | DATE | NOT NULL | 会费到期日 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 更新时间 |

**State Transitions**:
```
在籍 → 停用 (行政同事手动停用)
在籍 → 过期 (会费到期自动)
停用 → 在籍 (行政同事恢复)
过期 → 在籍 (续费后恢复)
```

### 2. Application（入会申请）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | 申请唯一标识 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| id_number | VARCHAR(18) | UNIQUE, NOT NULL | 身份证号码 |
| applicant_name | VARCHAR(50) | NOT NULL | 申请人姓名 |
| applicant_phone | VARCHAR(20) | NOT NULL | 申请人电话 |
| applicant_email | VARCHAR(100) | NULLABLE | 申请人邮箱 |
| applicant_address | TEXT | NULLABLE | 申请人地址 |
| career_history | TEXT | NULLABLE | 从业经历 |
| qualifications | TEXT | NULLABLE | 相关资质 |
| status | ENUM | NOT NULL, DEFAULT '待审核' | 待审核/初審通过/初審不通过/终審通过/终審不通过/待缴费/已缴费/已入会/已过期 |
| screening_result | TEXT | NULLABLE | 初審结果详情 |
| screening_by | VARCHAR(50) | NULLABLE | 初審操作者（系统/AI） |
| final_review_result | TEXT | NULLABLE | 终審结果详情 |
| final_review_by | UUID | NULLABLE, FK→Member | 终審操作者（root理事） |
| payment_proof_url | TEXT | NULLABLE | 缴费凭证截图路径 |
| payment_verified_by | UUID | NULLABLE, FK→Member | 缴费确认者（root理事） |
| payment_verified_at | TIMESTAMP | NULLABLE | 缴费确认时间 |
| member_id | UUID | NULLABLE, FK→Member | 成功后关联的会员ID |
| submitted_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 提交时间 |
| payment_due_date | TIMESTAMP | NULLABLE | 缴费截止日期（终審通过+7天） |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 更新时间 |

**State Transitions**:
```
待审核 → 初審通过 / 初審不通过
初審通过 → 终審通过 / 终審不通过
终審通过 → 待缴费
待缴费 → 已缴费 (凭证上传+root确认)
待缴费 → 已过期 (逾期7天未缴纳)
已缴费 → 已入会 (会员记录创建)
```

### 3. ConstitutionRules（会员章程规则）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | 规则唯一标识 |
| rule_type | ENUM | NOT NULL | 规则类型：入会条件/筛选标准/评估标准 |
| rule_key | VARCHAR(50) | NOT NULL | 规则键名 |
| rule_value | JSONB | NOT NULL | 规则值（灵活的JSON结构） |
| description | TEXT | NULLABLE | 规则说明 |
| version | INTEGER | NOT NULL, DEFAULT 1 | 版本号（支持章程变更历史） |
| effective_at | TIMESTAMP | NOT NULL | 生效时间 |
| expired_at | TIMESTAMP | NULLABLE | 失效时间（NULL=现行有效） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 创建时间 |

**Rule Examples**:
```json
// 入会条件
{"rule_type": "入会条件", "rule_key": "min_age", "rule_value": {"operator": ">=", "value": 18}}
}
// 初審筛选
{"rule_type": "筛选标准", "rule_key": "required_fields", "rule_value": ["career_history", "qualifications"]}
```

### 4. Event（活动）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | 活动唯一标识 |
| title | VARCHAR(200) | NOT NULL | 活动名称 |
| description | TEXT | NULLABLE | 活动描述 |
| event_date | TIMESTAMP | NOT NULL | 活动时间 |
| location | VARCHAR(200) | NOT NULL | 活动地点 |
| price_normal | INTEGER | NOT NULL, DEFAULT 0 | 普通会员费用 |
| price_advanced | INTEGER | NULLABLE | 高级会员8折费用（NULL=自动计算 price_normal*0.8） |
| max_participants | INTEGER | NULLABLE | 人数上限（NULL=不限） |
| registration_status | ENUM | NOT NULL, DEFAULT '开放' | 报名状态：开放/已满/截止 |
| created_by | UUID | NOT NULL, FK→Member | 创建者（行政同事） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 创建时间 |

### 5. EventRegistration（活动报名）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | 报名唯一标识 |
| event_id | UUID | NOT NULL, FK→Event | 活动ID |
| member_id | UUID | NOT NULL, FK→Member | 会员ID |
| registered_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 报名时间 |
| status | ENUM | NOT NULL, DEFAULT '已报名' | 状态：已报名/已取消 |

**Constraint**: UNIQUE(event_id, member_id) — 同一会员同一活动仅可报名一次

### 6. Notification（通知）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | 通知唯一标识 |
| member_id | UUID | NOT NULL, FK→Member | 接收会员ID |
| type | ENUM | NOT NULL | 类型：活动/缴费/系统更新 |
| title | VARCHAR(200) | NOT NULL | 通知标题 |
| content | TEXT | NOT NULL | 通知内容 |
| send_status | ENUM | NOT NULL, DEFAULT '待发送' | 发送状态：待发送/已发送/发送失败 |
| sent_at | TIMESTAMP | NULLABLE | 发送时间 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 创建时间 |

### 7. FAQ（常见问题知识库）

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | FAQ唯一标识 |
| question | TEXT | NOT NULL | 标准问题 |
| answer | TEXT | NOT NULL | 标准答案 |
| category | VARCHAR(50) | NOT NULL | 分类：入会条件/流程/费用/权益/活动 |
| embedding_id | VARCHAR(100) | NULLABLE | Chroma 中对应 embedding 的 ID |
| is_active | BOOLEAN | DEFAULT TRUE | 是否启用 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 创建时间 |

## Validation Rules

- Member.phone: 澳门电话号码格式 (+853 XXXXXXXX)
- Member.email: 标准 email 格式（可选）
- Application: 提交时 career_history 和 qualifications 至少填一项
- Application: 同一 phone 的待审核/初審通过/终審通过/待缴费申请最多一条（防重复）
- Application: username 和 id_number 全系统唯一，被占用时拒绝提交
- EventRegistration: event_id + member_id 唯一约束
- ConstitutionRules: rule_key 同类规则同时仅一条有效（expired_at IS NULL）
- Member.annual_fee: 普通=500, 高级=2000, 理事=0
- Member.username: 全系统唯一，终身不可修改
- Member.id_number: 全系统唯一，终身不可修改

## Indexes

- Member: (openid), (username), (id_number), (phone), (tier), (status)
- Application: (status), (username), (id_number), (applicant_phone), (submitted_at)
- Notification: (member_id, send_status), (type)
- Event: (event_date), (registration_status)
