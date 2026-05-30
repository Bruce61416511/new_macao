import json
from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.application import Application
from ..models.constitution_rules import ConstitutionRule
from ..ai.deepseek_client import chat


# rule_key -> Application 字段映射，用于前置空值检查
RULE_FIELD_MAP = {
    "address_region": "applicant_address",
    "从业经历": "career_history",
    "qualification": "qualifications",
}


class ScreeningService:
    """AI 语义驱动的自动化初審服务"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def evaluate(self, application: Application) -> dict:
        """根据现行章程规则，调用大模型逐条评估申请"""
        rules_result = await self.db.execute(
            select(ConstitutionRule).where(
                ConstitutionRule.rule_type.in_(["入会条件", "筛选标准"]),
                ConstitutionRule.expired_at.is_(None)
            )
        )
        rules = rules_result.scalars().all()

        if not rules:
            return {"passed": True, "reasons": ["无生效规则，自动通过"]}

        # 前置检查：空值直接拒绝，不浪费 AI 调用
        pre_reasons = []
        ai_rules = []
        for rule in rules:
            field = RULE_FIELD_MAP.get(rule.rule_key)
            if field:
                val = getattr(application, field, None)
                if not val or not str(val).strip():
                    pre_reasons.append(f"[{rule.rule_key}] ✗ {rule.description}（字段未填写）")
                    continue
            # min_age 特殊处理：年龄可计算才送 AI
            if rule.rule_key == "min_age":
                age = self._calc_age(application.id_number)
                if age is None:
                    pre_reasons.append(f"[{rule.rule_key}] ✗ {rule.description}（身份证号无效，无法计算年龄）")
                    continue
            ai_rules.append(rule)

        # 如果全部被前置拦截，直接返回
        if not ai_rules:
            if pre_reasons:
                return {"passed": False, "reasons": pre_reasons}
            return {"passed": True, "reasons": ["无生效规则，自动通过"]}

        # AI 判断剩余规则
        prompt = self._build_prompt(application, ai_rules)
        try:
            raw = await chat(
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0,
                max_tokens=2048
            )
            ai_result = self._parse_result(raw, ai_rules)
        except Exception as e:
            # AI 异常时，前置结果仍有效
            if pre_reasons:
                return {"passed": False, "reasons": pre_reasons}
            return {
                "passed": True,
                "reasons": [f"AI 審核暂不可用，转人工处理 ({str(e)[:100]})"]
            }

        # 合并前置结果和 AI 结果
        reasons = pre_reasons + ai_result["reasons"]
        passed = ai_result["passed"] and len(pre_reasons) == 0
        return {"passed": passed, "reasons": reasons}

    def _calc_age(self, id_number: str) -> int | None:
        # Strip _upd_ suffix for member info update applications
        import re
        clean_id = re.sub(r'_upd_\d+$', '', id_number)
        try:
            if len(clean_id) == 18:
                birth = date(int(clean_id[6:10]), int(clean_id[10:12]), int(clean_id[12:14]))
            elif len(clean_id) == 15:
                birth = date(int("19" + clean_id[6:8]), int(clean_id[8:10]), int(clean_id[10:12]))
            else:
                return None
            today = date.today()
            return today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
        except (ValueError, IndexError):
            return None

    def _build_prompt(self, app: Application, rules) -> str:
        age = self._calc_age(app.id_number)
        age_info = f"{age}岁" if age is not None else "未知"
        addr = app.applicant_address or "未填写"
        career = app.career_history or "未填写"

        questions = []
        for r in rules:
            rk = r.rule_key
            desc = r.description
            if rk == "min_age":
                questions.append(f"[{rk}] 申请人年龄{age_info}，要求：{desc}。{age_info}是否满足该要求？")
            elif rk == "address_region":
                questions.append(f"[{rk}] 地址={addr}，要求={desc}。满足？")
            elif "从业" in rk or "经历" in rk:
                questions.append(f"[{rk}] 经历={career}，要求={desc}。满足？")
            else:
                questions.append(f"[{rk}] 要求={desc}。满足？")

        questions_text = "\n".join(questions)

        return f"""逐条回答是或否，禁止说"不确定"。\n注意：地址检查中，香港、澳门、台湾均视为中国境内地区。\n\n申请人：{app.applicant_name}，年龄{age_info}\n\n{questions_text}\n\n只返回JSON：{{"results":[{{"rule_key":"...","passed":true/false,"reason":"理由"}}],"overall_passed":true/false}}"""

    def _parse_result(self, raw: str, rules) -> dict:
        raw = raw.strip()
        if raw.startswith("```"):
            lines = raw.split("\n")
            raw = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])

        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            start = raw.find("{")
            end = raw.rfind("}")
            if start >= 0 and end > start:
                data = json.loads(raw[start:end+1])
            else:
                return {"passed": True, "reasons": ["AI 返回格式异常，转人工处理"]}

        results = data.get("results", [])
        reasons = []
        passed = True

        seen_keys = {r.get("rule_key") for r in results}
        for rule in rules:
            if rule.rule_key not in seen_keys:
                results.append({"rule_key": rule.rule_key, "passed": True, "reason": "（未评估，默认通过）"})

        for r in results:
            if not r.get("passed", True):
                passed = False
            reasons.append(f"[{r.get('rule_key', '?')}] {'✓' if r.get('passed', True) else '✗'} {r.get('reason', '')}")

        if data.get("overall_passed") is False:
            passed = False

        return {"passed": passed, "reasons": reasons}

    async def perform_screening(self, application: Application, result: str, reason: str) -> Application:
        if result == "pass":
            application.status = "初審通過"
        else:
            application.status = "初審不通過"
        application.screening_result = reason
        application.screening_by = "AI系统"
        await self.db.flush()
        return application