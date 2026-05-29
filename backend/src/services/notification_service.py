import logging
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


class NotificationService:
    """通知服务：站内信 + 微信模板消息"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def send_to_member(self, member_id: str, title: str, content: str, ntype: str = "系统更新") -> dict:
        """发送站内通知给单个会员"""
        from ..models.notification import Notification
        import uuid
        import re
        clean_id = re.sub(r'[^0-9a-fA-F]', '', str(member_id))
        if len(clean_id) == 32:
            mid = uuid.UUID(clean_id)
        else:
            # Try to resolve as username
            from ..models.member import Member
            from sqlalchemy import select
            result = await self.db.execute(select(Member).where(Member.username == str(member_id)))
            member = result.scalar_one_or_none()
            if member:
                mid = member.id
            else:
                logger.error(f"[NOTIFY] Invalid member_id: {member_id}")
                return {"status": "error", "member_id": str(member_id), "error": "User not found"}
        notification = Notification(
            member_id=mid,
            type=ntype,
            title=title,
            content=content,
            send_status="已发送"
        )
        self.db.add(notification)
        await self.db.flush()
        logger.info(f"[NOTIFY] To member={member_id} | {ntype} | {title}")
        return {"status": "sent", "member_id": member_id, "type": ntype, "id": str(notification.id)}

    async def send_to_members(self, member_ids: List[str], title: str, content: str, ntype: str = "系统更新") -> dict:
        """批量发送通知"""
        for mid in member_ids:
            await self.send_to_member(mid, title, content, ntype)
        return {"notification_count": len(member_ids)}

    async def send_miniprogram_subscribe(self, openid: str, template_id: str, data: dict) -> dict:
        """微信小程序订阅消息"""
        logger.info(f"[WX-SUBSCRIBE] To openid={openid} template={template_id} data={data}")
        return {"status": "queued", "openid": openid}

    async def send_web_notification(self, member_id: str, title: str, content: str) -> dict:
        """Web H5 站内通知"""
        logger.info(f"[WEB-NOTIFY] To member={member_id} | {title}")
        return {"status": "sent", "member_id": member_id}

    async def dispatch_application_notification(self, application_id: str, event: str, member_id: str | None = None) -> dict:
        """入会申请相关通知分发：審批结果、缴费提醒、入会确认"""
        templates = {
            "screening_passed": {"title": "初審通过", "content": "您的入会申请已通过初審，等待理事终審。"},
            "screening_failed": {"title": "初審不通过", "content": "您的入会申请未通过初審，请查看驳回理由。"},
            "final_passed": {"title": "终審通过", "content": "恭喜！您的入会申请已通过终審，请在7天内缴纳会费。"},
            "payment_reminder": {"title": "缴费提醒", "content": "您的会费尚未缴纳，请及时完成缴费以免申请过期。"},
            "member_created": {"title": "入会成功", "content": "欢迎加入澳门直播协会！您已成为正式会员。"},
        }
        tpl = templates.get(event, {"title": "系统通知", "content": f"申请 {application_id} 状态更新"})
        if member_id:
            await self.send_web_notification(member_id, tpl["title"], tpl["content"])
        logger.info(f"[APP-NOTIFY] App={application_id} event={event}")
        return {"status": "dispatched", "event": event}
