import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.application import Application

logger = logging.getLogger(__name__)


async def escalate_timeout_applications(db: AsyncSession) -> int:
    """终審24h超时 → 标记已过期"""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    result = await db.execute(
        select(Application).where(Application.status == "终審通过", Application.updated_at < cutoff)
    )
    overdue = result.scalars().all()
    for app in overdue:
        app.status = "已过期"
        logger.warning(f"[ESCALATION] App {app.id} stuck in 终審通过 >24h, marked expired")
    await db.flush()
    return len(overdue)


async def escalate_payment_timeout(db: AsyncSession) -> dict:
    """缴费超时升级：3天催办root，7天升级行政同事"""
    now = datetime.now(timezone.utc)
    day3 = now - timedelta(days=3)
    day7 = now - timedelta(days=7)

    result = await db.execute(
        select(Application).where(Application.status == "待繳費", Application.updated_at < day7)
    )
    week_overdue = result.scalars().all()
    for app in week_overdue:
        app.status = "已过期"
        logger.warning(f"[PAYMENT-ESCALATION] App {app.id} unpaid >7d, escalated to admin, marked expired")

    result = await db.execute(
        select(Application).where(Application.status == "待繳費", Application.updated_at < day3, Application.updated_at >= day7)
    )
    day3_overdue = result.scalars().all()
    for app in day3_overdue:
        logger.warning(f"[PAYMENT-ESCALATION] App {app.id} unpaid >3d, nudging root director")

    await db.flush()
    return {"nudged_root": len(day3_overdue), "escalated_admin": len(week_overdue)}


async def run_escalation_loop(db_factory, interval_seconds: int = 3600):
    """后台循环：每小时检查"""
    while True:
        try:
            async with db_factory() as db:
                count = await escalate_timeout_applications(db)
                payment_result = await escalate_payment_timeout(db)
                if count > 0 or payment_result["nudged_root"] > 0 or payment_result["escalated_admin"] > 0:
                    logger.info(f"Escalation: timeout={count}, payment_nudge={payment_result['nudged_root']}, payment_escalate={payment_result['escalated_admin']}")
        except Exception as e:
            logger.error(f"Escalation check failed: {e}")
        await asyncio.sleep(interval_seconds)
