"""FAQ种子数据：澳门直播协会常见问答"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from sqlalchemy import select
from src.core.database import async_session_factory
from src.models.faq import FAQ

SEED_FAQS = [
    {"question": "入会需要什么条件？", "answer": "澳门直播协会入会条件：1）年满18周岁；2）从事直播或相关行业；3）填写入会申请表并通过审核。具体请查看《会员章程》。", "category": "入会条件"},
    {"question": "入会流程是怎样的？", "answer": "入会流程：1）在线提交申请；2）AI初審；3）理事终審；4）终審通过后缴纳年费；5）缴费确认后正式成为会员。全程约3-7个工作日。", "category": "流程"},
    {"question": "会费多少钱？", "answer": "会费标准：普通会员每年500澳门元，高级会员每年2000澳门元，理事免年费。高级会员享有活动8折优惠。", "category": "费用"},
    {"question": "会员有哪些权益？", "answer": "会员权益包括：1）参加协会活动享受折扣；2）获取行业资讯和资源；3）参与协会内部交流；4）高级会员享有更多专属福利和优先报名权。", "category": "权益"},
    {"question": "如何参加活动？", "answer": "在活动页面浏览即将举办的活动，选择感兴趣的活动点击报名即可。普通会员按原价，高级会员8折。部分活动有人数上限，先到先得。", "category": "活动"},
    {"question": "如何修改个人资料？", "answer": "登录后在个人中心页面可以修改手机号、邮箱、地址等信息。用户名和身份证号码不可修改，如需更改请联系行政同事。", "category": "资料"},
    {"question": "会费到期了怎么办？", "answer": "会费到期后会员状态将自动变为"过期"。您可以在到期前收到系统提醒，及时续费即可恢复在籍状态。", "category": "费用"},
    {"question": "申请被驳回了怎么办？", "answer": "申请被驳回后会显示驳回理由。您可以根据理由修改申请资料后重新提交。初審驳回可立即重申请，终審驳回需等待30天后重新提交。", "category": "流程"},
]


async def seed():
    async with async_session_factory() as db:
        result = await db.execute(select(FAQ).limit(1))
        if result.scalar_one_or_none():
            print("FAQ数据已存在，跳过种子数据加载")
            return
        for item in SEED_FAQS:
            faq = FAQ(**item)
            db.add(faq)
        await db.commit()
        print(f"已加载 {len(SEED_FAQS)} 条FAQ种子数据")


if __name__ == "__main__":
    asyncio.run(seed())
