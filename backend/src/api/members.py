import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from ..core.database import get_db
from ..core.security import get_current_user, require_role
from ..services.member_service import MemberService
from ..services.application_service import ApplicationService

router = APIRouter(prefix="/v1/members", tags=["members"])


class MemberUpdate(BaseModel):
    phone: str | None = None
    email: str | None = None
    real_name: str | None = None
    address: str | None = None
    career_history: str | None = None
    qualifications: str | None = None
    qualification_files: str | None = None


class StaffMemberUpdate(BaseModel):
    phone: str | None = None
    email: str | None = None
    real_name: str | None = None
    tier: str | None = None
    annual_fee: int | None = None
    is_active: bool | None = None


@router.get("/me", response_model=dict)
async def get_my_profile(user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user is None:
        raise HTTPException(status_code=401, detail="请先登录")
    svc = MemberService(db)
    member = await svc.get_by_id(uuid.UUID(user.get("sub")))
    if not member:
        raise HTTPException(status_code=404, detail="会员不存在")
    return {"member": svc._to_dict(member)}


@router.patch("/me", response_model=dict)
async def update_my_profile(body: MemberUpdate, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user is None:
        raise HTTPException(status_code=401, detail="请先登录")
    svc = MemberService(db)
    member = await svc.get_by_id(uuid.UUID(user.get("sub")))
    if not member:
        raise HTTPException(status_code=404, detail="会员不存在")
    member = await svc.update_member(member, body.model_dump(exclude_none=True))
    return {"member": svc._to_dict(member)}


@router.get("/me/tier", response_model=dict)
async def get_my_tier(user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user is None:
        raise HTTPException(status_code=401, detail="请先登录")
    svc = MemberService(db)
    member = await svc.get_by_id(uuid.UUID(user.get("sub")))
    if not member:
        raise HTTPException(status_code=404, detail="会员不存在")
    return {"tier": member.tier, "annual_fee": member.annual_fee}


@router.get("", response_model=dict)
async def list_members(
    tier: str | None = None,
    status: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: dict = Depends(require_role("staff", "root")),
    db: AsyncSession = Depends(get_db)
):
    svc = MemberService(db)
    return await svc.list_members(tier=tier, status=status, page=page, page_size=page_size)


@router.get("/{member_id}", response_model=dict)
async def get_member(
    member_id: str,
    user: dict = Depends(require_role("staff", "root")),
    db: AsyncSession = Depends(get_db)
):
    svc = MemberService(db)
    member = await svc.get_by_id(uuid.UUID(member_id))
    if not member:
        raise HTTPException(status_code=404, detail="会员不存在")
    return {"member": svc._to_dict(member)}


@router.patch("/{member_id}", response_model=dict)
async def update_member_by_staff(
    member_id: str,
    body: StaffMemberUpdate,
    user: dict = Depends(require_role("staff", "root")),
    db: AsyncSession = Depends(get_db)
):
    svc = MemberService(db)
    member = await svc.get_by_id(uuid.UUID(member_id))
    if not member:
        raise HTTPException(status_code=404, detail="会员不存在")
    member = await svc.update_by_staff(member, body.model_dump(exclude_none=True))
    return {"member": svc._to_dict(member)}


@router.delete("/{member_id}", response_model=dict)
async def delete_member(
    member_id: str,
    user: dict = Depends(require_role("staff", "root")),
    db: AsyncSession = Depends(get_db)
):
    svc = MemberService(db)
    result = await svc.hard_delete(uuid.UUID(member_id))
    if result.get("error"):
        detail = "不能删除在籍会员" if result["error"] == "cannot_delete_active" else "会员不存在"
        raise HTTPException(status_code=400, detail=detail)
    return result

@router.get("/export", response_class=PlainTextResponse)
async def export_members_csv(
    user: dict = Depends(require_role("staff", "root")),
    db: AsyncSession = Depends(get_db)
):
    svc = MemberService(db)
    csv_data = await svc.export_csv()
    return PlainTextResponse(content=csv_data, media_type="text/csv")


class MemberInfoUpdateRequest(BaseModel):
    applicant_name: str | None = None
    applicant_phone: str | None = None
    applicant_email: str | None = None
    applicant_address: str | None = None
    career_history: str | None = None
    qualifications: str | None = None
    requested_tier: str | None = None


@router.post("/me/update-info", status_code=201, response_model=dict)
async def update_member_info(body: MemberInfoUpdateRequest, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user is None:
        raise HTTPException(status_code=401, detail=请先登录)
    svc = MemberService(db)
    member = await svc.get_by_id(uuid.UUID(user.get("sub")))
    if not member:
        raise HTTPException(status_code=404, detail=会员不存在)
    if not member.is_active:
        raise HTTPException(status_code=403, detail=该账号当前不在籍无法修改信息)
    result = await svc.create_info_update_application(member, body.model_dump(exclude_none=True))
    return result

class BoardManageRequest(BaseModel):
    member_id: str
    is_board: bool = True


@router.post("/manage-board", response_model=dict)
async def manage_board(body: BoardManageRequest, user: dict = Depends(require_role("root")), db: AsyncSession = Depends(get_db)):
    svc = MemberService(db)
    member = await svc.get_by_id(uuid.UUID(body.member_id))
    if not member:
        raise HTTPException(status_code=404, detail="会员不存在")
    if body.is_board:
        member.tier = "理事"
        member.annual_fee = 0
    await svc.update_by_staff(member, {"tier": member.tier, "annual_fee": member.annual_fee})
    return {"id": str(member.id), "tier": member.tier, "annual_fee": member.annual_fee}


# --- Admin endpoints ---

router_admin = APIRouter(prefix="/v1/admin/members", tags=["admin"])

class AdminMemberUpdate(BaseModel):
    username: str | None = None
    real_name: str | None = None
    phone: str | None = None
    email: str | None = None
    tier: str | None = None
    annual_fee: int | None = None
    is_active: bool | None = None
    address: str | None = None
    career_history: str | None = None
    qualifications: str | None = None
    qualification_files: str | None = None


@router_admin.get("", response_model=dict)
async def admin_list_members(
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=500),
    user: dict = Depends(require_role("root")),
    db: AsyncSession = Depends(get_db)
):
    svc = MemberService(db)
    result = await svc.list_members(page=page, page_size=page_size)
    # Rebuild items with admin dict (unmasked phone, all fields)
    members = result["items"]
    admin_items = []
    for item in members:
        member = await svc.get_by_id(uuid.UUID(item["id"]))
        if member:
            admin_items.append(svc._to_admin_dict(member))
    return {"items": admin_items, "total": result["total"], "page": result["page"]}


@router_admin.patch("/{member_id}", response_model=dict)
async def admin_update_member(
    member_id: str,
    body: AdminMemberUpdate,
    user: dict = Depends(require_role("root")),
    db: AsyncSession = Depends(get_db)
):
    svc = MemberService(db)
    member = await svc.get_by_id(uuid.UUID(member_id))
    if not member:
        raise HTTPException(status_code=404, detail="会员不存在")
    data = body.model_dump(exclude_none=True)
    for k, v in data.items():
        setattr(member, k, v)
    member.updated_at = __import__("datetime").datetime.now(__import__("datetime").timezone.utc)
    await db.flush()
    return {"member": svc._to_admin_dict(member)}


@router_admin.delete("/{member_id}", response_model=dict)
async def admin_delete_member(
    member_id: str,
    user: dict = Depends(require_role("root")),
    db: AsyncSession = Depends(get_db)
):
    svc = MemberService(db)
    result = await svc.force_delete(uuid.UUID(member_id))
    if result.get("error"):
        raise HTTPException(status_code=404, detail="会员不存在")
    return result


@router_admin.get("/applications", response_model=dict)
async def admin_list_applications(
    page: int = Query(1, ge=1),
    page_size: int = Query(200, ge=1, le=500),
    user: dict = Depends(require_role("root")),
    db: AsyncSession = Depends(get_db)
):
    svc = ApplicationService(db)
    result = await svc.list_applications(page=page, page_size=page_size)
    items = []
    for app in result.get("items", []):
        uname = app.get("username", "") or ""
        if "_upd_" in uname:
            uname = uname.split("_upd_")[0]
        idnum = app.get("id_number", "") or ""
        if len(idnum) > 6:
            idnum = idnum[:6] + "****" + idnum[-4:] if len(idnum) > 10 else idnum[:4] + "****" + idnum[-2:]
        items.append({
            "id": app.get("id"),
            "username": uname,
            "id_number": idnum,
            "applicant_name": app.get("applicant_name", ""),
            "applicant_phone": app.get("applicant_phone", ""),
            "applicant_email": app.get("applicant_email", ""),
            "status": app.get("status", ""),
            "requested_tier": app.get("requested_tier", ""),
            "submitted_at": app.get("submitted_at"),
            "member_id": app.get("member_id"),
            "career_history": app.get("career_history", ""),
            "qualifications": app.get("qualifications", ""),
            "qualification_files": app.get("qualification_files", ""),
        })
    return {"items": items, "total": len(items), "page": page}
