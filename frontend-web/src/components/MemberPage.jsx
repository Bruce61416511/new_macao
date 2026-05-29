import { useState, useEffect, useRef } from "react";
import { getMyProfile } from "../services/api.js";
import UpdateProfileModal from "./UpdateProfileModal.jsx";
import ProfileViewModal from "./ProfileViewModal.jsx";
import BenefitsModal from "./BenefitsModal.jsx";
import { useAuth } from "../contexts/AuthContext";
﻿const sidebarItems = [
  { label: '会员中心', active: true, icon: HomeIcon },
  { label: '资料中心', icon: FolderIcon },
  { label: '我的权益', icon: ShieldIcon },
  { label: '协会活动', icon: CalendarIcon },
  { label: '培训课程', icon: BookIcon },
  { label: '消息通知', badge: 3, icon: BellIcon },
  { label: '我的收藏', icon: BookmarkIcon },
  { label: '设置中心', icon: GearIcon },
  { label: '会员终审', icon: CheckBadgeIcon, adminOnly: true },
  { label: '缴费审批', icon: CardIcon, adminOnly: true },
  { label: '会员管理', icon: UsersIcon, adminOnly: true },
];

const actions = [  { label: '续费', icon: CardIcon },  ({ label: '更新资料', icon: IdIcon }),
];

const updates = [
  { title: '已报名：行业沙龙', desc: '数字化转型与中小企业长沙龙', date: '2025-05-20', icon: CalendarIcon },
  { title: '待处理：资料更新确认', desc: '请确认并提交最新的企业资料', date: '2025-05-18', icon: FileTextIcon },
  { title: '等级建议：再参与 1 次协会活动，可达下一等级', desc: '当前成长值 80 / 100', progress: true, icon: TrendIcon },
];

const credentials = [
  { title: '澳门特区政府', desc: '注册社团', icon: SealIcon },
  { title: '非营利性社团', desc: '登记证明', icon: MedalIcon },
  { title: '年度审计报告', desc: '已公示', icon: ReportIcon },
  { title: '个人资料保护', desc: '合规认证', icon: LockBadgeIcon },
];

const services = [
  { label: '商务对接', icon: HandshakeIcon },
  { label: '政策咨询', icon: MessageIcon },
  { label: '法律支援', icon: ScaleIcon },
  { label: '品牌推广', icon: ChartIcon },
];

const recommendations = [
  { tag: '活动', title: '跨境电商交流会', date: '2025-06-05 14:30', image: '/activity-card-1.webp' },
  { tag: '培训', title: '财税合规实务培训', date: '2025-06-10 09:30', image: '/activity-card-2.webp' },
  { tag: '活动', title: '会员交流晚宴', date: '2025-06-18 18:30', image: '/activity-card-3.webp' },
  { tag: '培训', title: 'AI商业应用工作坊', date: '2025-06-25 14:00', image: '/activity-card-4.webp' },
];

function LotusLogo({ className = 'h-12 w-12' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 64 64">
      <path d="M32 6c4.3 7.4 8 13.2 8 21.1 0 9.1-4.3 14.9-8 18.1-3.7-3.2-8-9-8-18.1C24 19.2 27.7 13.4 32 6Z" fill="currentColor" />
      <path d="M15 21c9.3.8 16.4 6.2 17 20-10.9-1.2-17.2-8.2-17-20ZM49 21c-9.3.8-16.4 6.2-17 20 10.9-1.2 17.2-8.2 17-20Z" fill="currentColor" opacity=".82" />
      <path d="M8 37c9.8-.3 18.8 2.8 24 10-11.5 2.8-20.1-1-24-10ZM56 37c-9.8-.3-18.8 2.8-24 10 11.5 2.8 20.1-1 24-10Z" fill="currentColor" opacity=".95" />
      <path d="M19 50c6.6 2.7 19.4 2.7 26 0-3.2 4.5-7.7 6.8-13 6.8S22.2 54.5 19 50Z" fill="currentColor" />
    </svg>
  );
}

function IconShell({ children, className = '' }) {
  return <span className={`grid h-10 w-10 place-items-center rounded-[9px] text-[#006252] ${className}`}>{children}</span>;
}

function HomeIcon() {
  return <PathIcon d="M4 11.5 12 5l8 6.5V20h-5v-6H9v6H4z" />;
}

function ShieldIcon() {
  return <PathIcon d="M12 3.5 19 6.7v5.1c0 4.7-2.5 7.9-7 9.7-4.5-1.8-7-5-7-9.7V6.7z" />;
}

function ShieldCheckOutlineIcon() {
  return <OutlineIcon><path d="M12 3.5 19 6.7v5.1c0 4.7-2.5 7.9-7 9.7-4.5-1.8-7-5-7-9.7V6.7z" /><path d="m8.7 12 2.2 2.2 4.5-5" /></OutlineIcon>;
}

function CalendarIcon() {
  return <OutlineIcon><rect height="15" rx="2" width="17" x="3.5" y="5.5" /><path d="M8 3.5v4M16 3.5v4M3.5 10h17" /></OutlineIcon>;
}

function BookIcon() {
  return <OutlineIcon><path d="M5 4.5h9a3 3 0 0 1 3 3v12H8a3 3 0 0 0-3 3z" /><path d="M17 7.5h2a1 1 0 0 1 1 1v12h-3" /></OutlineIcon>;
}

function CalendarCheckIcon() {
  return <OutlineIcon><rect height="15" rx="2" width="17" x="3.5" y="5.5" /><path d="M8 3.5v4M16 3.5v4M3.5 10h17M8 15l2 2 4-4" /></OutlineIcon>;
}

function FolderIcon() {
  return <OutlineIcon><path d="M3.5 7.5h6l2 2h9v9.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" /></OutlineIcon>;
}

function CheckBadgeIcon() {
  return <OutlineIcon><path d="M12 3.5 19 6.7v5.1c0 4.7-2.5 7.9-7 9.7-4.5-1.8-7-5-7-9.7V6.7z" /><path d="m8.7 12 2.2 2.2 4.5-5" /></OutlineIcon>;
}

function UsersIcon() {
  return <OutlineIcon><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.8-3.2 2.6-4.8 5.5-4.8s4.7 1.6 5.5 4.8M16 11a2.5 2.5 0 1 0 0-5M16.5 14.4c2.2.4 3.6 1.9 4.2 4.6" /></OutlineIcon>;
}

function BellIcon() {
  return <OutlineIcon><path d="M18.5 16H5.5c1.5-1.6 2-3.1 2-6.5a4.5 4.5 0 0 1 9 0c0 3.4.5 4.9 2 6.5Z" /><path d="M10 19a2.1 2.1 0 0 0 4 0" /></OutlineIcon>;
}

function BookmarkIcon() {
  return <OutlineIcon><path d="M7 4.5h10v16l-5-3.4-5 3.4z" /></OutlineIcon>;
}

function GearIcon() {
  return <OutlineIcon><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" /><path d="M19.4 13.6v-3.2l-2.1-.5-.8-1.9 1.1-1.8-2.3-2.3-1.8 1.1-1.9-.8-.6-2.1H9l-.6 2.1-1.9.8-1.8-1.1-2.3 2.3L3.5 8l-.8 1.9-2.1.5v3.2l2.1.5.8 1.9-1.1 1.8 2.3 2.3 1.8-1.1 1.9.8.6 2.1h3.2l.6-2.1 1.9-.8 1.8 1.1 2.3-2.3-1.1-1.8.8-1.9z" /></OutlineIcon>;
}

function ShieldStarIcon() {
  return <PathIcon d="M12 2.7 20 6.1v5.8c0 5-2.9 8.4-8 10.4-5.1-2-8-5.4-8-10.4V6.1zM12 7l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" />;
}

function CalendarSolidIcon() {
  return <PathIcon d="M6 3.5h2v2h8v-2h2v2h2v15H4v-15h2zm-1 7v8.5h14V10.5zM8 13h3v3H8z" />;
}

function CardIcon() {
  return <PathIcon d="M3.5 6.5h17v11h-17zM3.5 9.5h17M6.5 14.5h5M17 14.5h1" />;
}

function CrownIcon() {
  return <PathIcon d="M4 8.5 8.3 12 12 5l3.7 7L20 8.5v9H4zM5.5 20h13" />;
}

function CheckCircleIcon() {
  return <OutlineIcon><circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.4 2.4L16.5 9" /></OutlineIcon>;
}

function GiftIcon() {
  return <OutlineIcon><rect height="11" rx="1.5" width="17" x="3.5" y="9" /><path d="M12 9v11M3.5 13h17M8.2 9C6.5 8.5 5.5 7.6 5.7 6.4c.2-1.2 1.5-1.8 2.7-1 1.1.7 2 2.2 2.7 3.6M15.8 9c1.7-.5 2.7-1.4 2.5-2.6-.2-1.2-1.5-1.8-2.7-1-1.1.7-2 2.2-2.7 3.6" /></OutlineIcon>;
}

function SealIcon() {
  return <OutlineIcon><circle cx="12" cy="10" r="5" /><path d="m9 15-1.3 5 4.3-2 4.3 2L15 15" /></OutlineIcon>;
}

function MedalIcon() {
  return <OutlineIcon><circle cx="12" cy="13" r="5" /><path d="M9 3.5 12 8l3-4.5M8 3.5h8M12 10.5l.8 1.7 1.9.3-1.4 1.3.3 1.9-1.6-.9-1.6.9.3-1.9-1.4-1.3 1.9-.3z" /></OutlineIcon>;
}

function ReportIcon() {
  return <OutlineIcon><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4M9 13h6M9 17h4M9 9h2" /></OutlineIcon>;
}

function LockBadgeIcon() {
  return <OutlineIcon><path d="M12 3.5 19 6.7v5.1c0 4.7-2.5 7.9-7 9.7-4.5-1.8-7-5-7-9.7V6.7z" /><path d="M9 12h6v5H9zM10 12v-1.5a2 2 0 0 1 4 0V12" /></OutlineIcon>;
}

function HandshakeIcon() {
  return <OutlineIcon><path d="m8 13 2.5 2.5a2 2 0 0 0 2.8 0L16 13M7 9l3-3h4l3 3M3.5 12l4-4 3 3M20.5 12l-4-4-3 3M6 15l3 3M18 15l-3 3" /></OutlineIcon>;
}

function MessageIcon() {
  return <OutlineIcon><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9h8M8 13h5" /></OutlineIcon>;
}

function ScaleIcon() {
  return <OutlineIcon><path d="M12 4v16M6 7h12M8 7l-4 7h8zM16 7l-4 7h8zM8 20h8" /></OutlineIcon>;
}

function ChartIcon() {
  return <OutlineIcon><path d="M4 20h16M6 17V9M12 17V5M18 17v-6" /><path d="m15 6 3-3 3 3" /></OutlineIcon>;
}

function PhoneIcon() {
  return <OutlineIcon className="h-3.5 w-3.5"><path d="M7 4.5 10 8l-2 2c1.4 2.7 3.3 4.6 6 6l2-2 3.5 3c.2.2.2.6 0 .9-1.2 1.6-2.8 2.4-4.5 1.8-5.5-1.8-9.9-6.2-11.7-11.7-.6-1.7.2-3.3 1.8-4.5.3-.2.7-.2.9 0Z" /></OutlineIcon>;
}

function MailIcon() {
  return <OutlineIcon className="h-3.5 w-3.5"><rect height="13" rx="2" width="18" x="3" y="5.5" /><path d="m4 7 8 6 8-6" /></OutlineIcon>;
}

function ChatRoundIcon() {
  return <OutlineIcon className="h-3.5 w-3.5"><path d="M4 5.5h16v11H9l-5 4z" /><path d="M9 11h.1M12 11h.1M15 11h.1" /></OutlineIcon>;
}

function IdIcon() {
  return <PathIcon d="M5 4h14v16H5zM9 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm-1 9c.7-2.6 2-3.8 4-3.8s3.3 1.2 4 3.8" />;
}

function FileTextIcon() {
  return <OutlineIcon><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4M9 12h6M9 16h5" /></OutlineIcon>;
}

function TrendIcon() {
  return <OutlineIcon><path d="M4 18h16M6 16l4-5 3 3 5-7" /><path d="M18 7h-4M18 7v4" /></OutlineIcon>;
}

function PathIcon({ d }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  );
}

function OutlineIcon({ children, className = 'h-6 w-6' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">{children}</g>
    </svg>
  );
}

function MemberSidebar({ onViewProfile, onShowBenefits }) {
  const { user } = useAuth();
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col overflow-hidden bg-[linear-gradient(180deg,#00463d_0%,#005548_45%,#003f37_100%)] px-3 py-8 text-white shadow-[12px_0_30px_rgba(0,45,40,0.2)]">
      <div className="px-7">
        <img
          alt="澳门直播协会 小扬同学"
          className="h-auto w-[160px] select-none object-contain"
          draggable="false"
          src="/member-sidebar-logo.png"
        />
      </div>

      <nav className="mt-9 space-y-2">
        {sidebarItems.filter(item => !item.adminOnly || (user?.role === 'root')).map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={[
                'flex h-[48px] w-full items-center gap-4 rounded-[14px] px-5 text-[16px] font-semibold transition',
                item.active ? 'bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]' : 'text-white/82 hover:bg-white/10',
              ].join(' ')}
              key={item.label}
              type="button"
              onClick={item.label === "资料中心" ? onViewProfile : item.label === "协会活动" ? () => window.location.href = "/events" : item.label === "会员终审" ? () => window.location.href = "/admin/final-review" : item.label === "缴费审批" ? () => window.location.href = "/admin/payment-approval" : item.label === "会员管理" ? () => window.location.href = "/admin/members" : item.label === "我的权益" ? () => onShowBenefits() : undefined}
            >
              <Icon />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#ef513f] px-1 text-[11px] text-white">{item.badge}</span> : null}
            </button>
          );
        })}
      </nav>

      <div className="relative mt-auto h-[230px] overflow-hidden rounded-[18px] text-center">
        <img
          alt=""
          className="absolute inset-0 h-full w-full select-none object-fill"
          draggable="false"
          src="/member-subscribe-card-original.png"
        />
      </div>
    </aside>
  );
}


function MemberTopBar({ profile, dropdownOpen, setDropdownOpen, dropdownRef, onLogout }) {
    const { user } = useAuth();

    useEffect(() => {
      function handleClickOutside(e) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <header className="sticky top-0 z-30 flex h-[96px] items-center justify-between bg-white/72 px-11 backdrop-blur-xl">
        <h1 className="font-serifCn text-[34px] font-semibold leading-none text-[#00473f]">会员中心 － 小扬同学与你同行</h1>
        <div className="flex items-center gap-8 text-[#285c55]">
          <div className="flex items-center gap-2 text-[14px] font-semibold">
            <ShieldCheckOutlineIcon />
            权威认证 · 值得信赖
          </div>
          <div className="flex items-center gap-5 text-[14px] font-semibold">
            <span className="rounded-full bg-[#006252] px-4 py-2 text-white">简体</span>
            <span>繁體</span>
            <span>EN</span>
            <span>PT</span>
          </div>
          <div className="relative">
            <BellIcon />
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#ef513f] text-[10px] font-bold text-white">3</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
            >
              <div className="h-10 w-10 rounded-full bg-[url('/lotus-assistant.png')] bg-cover bg-center" />
              <span className="text-[15px] font-bold">{user?.username ?? "小扬同学"}⌄</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-[260px] rounded-[10px] border border-[#dde7e5] bg-white p-4 shadow-[0_14px_30px_rgba(35,70,74,0.16)] text-[#1b292b]">
                <div className="flex items-center gap-3 pb-3 border-b border-[#e5eceb]">
                  <div className="h-10 w-10 rounded-full bg-[url('/lotus-assistant.png')] bg-cover bg-center shrink-0" />
                  <div>
                    <p className="text-[15px] font-bold">{profile?.real_name || user?.username || "小扬同学"}</p>
                    <p className="text-[12px] text-[#6a7679]">{profile?.tier || "会员"}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-[#6a7679]">用户名</span>
                    <span className="font-medium">{profile?.username || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6a7679]">手机号</span>
                    <span className="font-medium">{profile?.phone || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6a7679]">邮箱</span>
                    <span className="font-medium">{profile?.email || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6a7679]">会员级别</span>
                    <span className="font-medium">{profile?.tier || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6a7679]">年费</span>
                    <span className="font-medium">{profile?.annual_fee ? `${profile.annual_fee} 澳门元` : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6a7679]">注册时间</span>
                    <span className="font-medium">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString("zh-CN") : "-"}</span>
                  </div>
                </div>
                <button
                  className="mt-3 w-full rounded-[6px] border border-[#cfd9d7] py-2 text-[13px] font-medium text-[#6a7679] hover:bg-[#f8fbfb]"
                  onClick={onLogout}
                  type="button"
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
  function MemberHero({ profile, onUpdateProfile }) {
  const { user } = useAuth();
  const memberNo = profile?.id ? `MMA-${profile.id.replace(/-/g, "").slice(-8).toUpperCase()}` : "加载中...";
  const yearEnd = `${new Date().getFullYear()}-12-31`;
  const [monthlyEvents, setMonthlyEvents] = useState(0);
  const [myMonthlyCount, setMyMonthlyCount] = useState(0);

  useEffect(() => {
    const now = new Date();
    Promise.all([
      fetch("/v1/events").then(r => r.json()),
      fetch("/v1/events/my", { headers: user ? { Authorization: `Bearer ${sessionStorage.getItem("token")}` } : {} }).then(r => r.ok ? r.json() : { items: [] })
    ]).then(([evData, myData]) => {
      const count = (evData.items || []).filter(e => {
        if (e.registration_status !== "开放") return false;
        const d = new Date(e.event_date);
        return d >= now;
      }).length;
      setMonthlyEvents(count);
      const myItems = myData.items || [];
      const myCount = myItems.filter(e => {
        const d = new Date(e.event_date);
        return d >= now;
      }).length;
      setMyMonthlyCount(myCount);
    }).catch(() => {});
  }, []);
  const statusText = profile?.is_active ? (profile?.tier || "正式会员") : "已停用";

  return (
    <section className="relative overflow-hidden rounded-[14px] bg-[#004f46] text-white shadow-[0_18px_36px_rgba(0,45,40,0.2)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_38%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(90deg,#004f46_0%,#005347_54%,rgba(0,83,71,0.2)_70%,rgba(0,83,71,0)_100%)]" />
      <div className="absolute bottom-[-18%] right-[-2%] top-[-18%] w-[68%] origin-center -rotate-[7deg] overflow-hidden border-l-[3px] border-[#d7b86a] [border-bottom-left-radius:88%_128%] [border-top-left-radius:98%_128%]">
        <img
          alt="大三巴牌坊与澳门建筑"
          className="h-full w-full rotate-[7deg] scale-[1.14] select-none object-cover object-center"
          draggable="false"
          src="/member-hero-building.webp"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,79,70,0.44)_0%,rgba(0,79,70,0.08)_32%,rgba(0,0,0,0)_100%)]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,79,70,0)_0%,rgba(0,79,70,0)_52%,rgba(0,79,70,0.1)_58%,rgba(0,79,70,0)_68%)]" />
      <div className="relative px-8 py-8">
        <div className="flex items-center gap-7">
          <div className="grid h-[94px] w-[94px] place-items-center rounded-full border-2 border-white bg-[#006252] text-[#f4e6c8]">
            <LotusLogo className="h-[66px] w-[66px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serifCn text-[35px] font-semibold leading-none">{profile?.real_name || user?.username || "小扬同学"}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1dba4] px-4 py-2 text-[14px] font-bold text-[#795915]">
                <CrownIcon />
                {statusText}
              </span>
            </div>
            <p className="mt-4 text-[15px] font-medium text-white/85">会员编号：{memberNo}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-[16px] font-semibold text-white/94">
          <p className="flex items-center gap-3">
            <span className="text-[#9ddfcd]"><CheckCircleIcon /></span>
            当前状态：{statusText}
          </p>
          <p className="flex items-center gap-3">
            <span className="text-[#9ddfcd]"><CalendarIcon /></span>
            会费到期：{profile?.annual_fee === 0 ? "永久生效" : profile?.is_active ? yearEnd : "-"}
          </p>
          <p className="flex items-center gap-3">
            <span className="text-[#9ddfcd]"><GiftIcon /></span>
            当前可用活动：{user?.role === "root" ? "-" : (monthlyEvents > 0 ? `${monthlyEvents} 场可报名` : "暂无")}{user?.role !== "root" && myMonthlyCount > 0 ? `，已报名 ${myMonthlyCount} 场` : ""}
          </p>
        </div>

        <div className="mt-8 grid max-w-[560px] grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button className="flex h-[40px] items-center justify-between rounded-[6px] bg-white px-4 text-[14px] font-bold text-[#004f46] shadow-[0_4px_10px_rgba(0,28,25,0.12)]" key={action.label} type="button" onClick={action.label === "更新资料" ? onUpdateProfile : action.onClick}>
                <span className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-[6px] text-[#006252] bg-[#eef7f5]"><Icon /></span>
                  {action.label}
                </span>
                <span className="text-[18px] font-light">›</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function RecentUpdates() {
  return (
    <section className="rounded-[12px] border border-[#dbe6e4] bg-white/82 p-4 shadow-[0_10px_24px_rgba(42,72,76,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[18px] font-bold text-[#004f46]">近期动态</h2>
        <a className="text-[13px] font-semibold text-[#647477]" href="#">查看全部 ›</a>
      </div>
      <div className="mt-3 overflow-hidden rounded-[9px] border border-[#dce6e4] bg-white/70">
        {updates.map((item) => {
          const Icon = item.icon;
          return (
            <article className="grid grid-cols-[42px_1fr_auto] items-center border-b border-[#e3ebe9] px-4 py-4 last:border-b-0" key={item.title}>
              <IconShell><Icon /></IconShell>
              <div>
                <p className="text-[15px] font-bold text-[#203335]">{item.title}</p>
                <p className="mt-1 text-[12px] font-medium text-[#6d7c7f]">{item.desc}</p>
                {item.progress ? <div className="mt-3 h-2 max-w-[310px] rounded-full bg-[#e4e7e6]"><div className="h-full w-4/5 rounded-full bg-[#006252]" /></div> : null}
              </div>
              <span className="text-[12px] font-medium text-[#7d8a8d]">{item.date || '80%'}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AssistantMini() {
  return (
    <section className="rounded-[12px] border border-[#dbe6e4] bg-white/82 p-5 text-center shadow-[0_10px_24px_rgba(42,72,76,0.12)] backdrop-blur-xl">
      <h2 className="text-left text-[18px] font-bold text-[#004f46]">智能小荷 · 您的会员助手</h2>
      <div className="mx-auto mt-5 grid h-[140px] w-[140px] place-items-center rounded-full bg-[#dff3ef] shadow-[inset_0_0_30px_rgba(0,98,82,0.16)]">
        <LotusLogo className="h-[90px] w-[90px] text-white drop-shadow-[0_8px_16px_rgba(0,98,82,0.22)]" />
      </div>
      <div className="mx-auto mt-3 w-fit rounded-[10px] bg-[#eef7f5] px-5 py-3 text-[13px] font-medium text-[#476468]">我可以帮你整理续费材料或报名活动</div>
      <button className="mt-4 rounded-full border border-[#006252] px-8 py-2 text-[14px] font-bold text-[#006252]" type="button">立即咨询</button>
    </section>
  );
}

function TrustCard() {
  return (
    <section className="rounded-[12px] border border-[#dbe6e4] bg-white/82 p-4 shadow-[0_10px_24px_rgba(42,72,76,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#004f46]">信任与资质</h2>
        <a className="text-[13px] font-semibold text-[#647477]" href="#">查看全部 ›</a>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {credentials.map((item) => {
          const Icon = item.icon;
          return (
          <article className="flex h-[72px] items-center gap-3 rounded-[8px] border border-[#dce6e4] bg-white/70 px-4" key={item.title}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eef7f5] text-[#006252]"><Icon /></span>
            <p className="text-[13px] font-bold text-[#24383a]">{item.title}<br /><span className="font-medium text-[#5d7073]">{item.desc}</span></p>
          </article>
          );
        })}
      </div>
    </section>
  );
}

function ServicesCard() {
  return (
    <section className="rounded-[12px] border border-[#dbe6e4] bg-white/82 p-4 shadow-[0_10px_24px_rgba(42,72,76,0.12)] backdrop-blur-xl">
      <h2 className="text-[18px] font-bold text-[#004f46]">专属服务</h2>
      <div className="mt-5 grid grid-cols-4 gap-3 text-center">
        {services.map((service) => {
          const Icon = service.icon;
          return (
          <div key={service.label}>
            <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-[#2c937b] text-white"><Icon /></span>
            <p className="mt-2 text-[12px] font-medium text-[#53676a]">{service.label}</p>
          </div>
          );
        })}
      </div>
    </section>
  );
}

function Recommendations() {
  return (
    <section className="flex-1 rounded-[12px] border border-[#dbe6e4] bg-white/82 p-4 shadow-[0_10px_24px_rgba(42,72,76,0.12)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#004f46]">为您推荐</h2>
        <a className="text-[13px] font-semibold text-[#006252]" href="#">换一批</a>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {recommendations.map((item, index) => (
          <article className="overflow-hidden rounded-[8px] bg-white shadow-sm" key={item.title}>
            <div className="relative h-[82px] overflow-hidden">
              <img
                alt=""
                className="h-full w-full select-none object-cover"
                draggable="false"
                src={item.image}
              />
              <span className="absolute left-2 top-2 rounded bg-[#2b8d75] px-2 py-1 text-[12px] font-bold text-white">{item.tag}</span>
              <div className={`absolute inset-0 ${index % 2 ? 'bg-[#ffffff]/45' : 'bg-[#004f46]/18'}`} />
            </div>
            <div className="px-2 py-2">
              <p className="text-[13px] font-bold text-[#203335]">{item.title}</p>
              <p className="mt-1 text-[12px] text-[#657477]">{item.date}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactCard() {
  const contacts = [
    { text: '(853) 2872 1234', icon: PhoneIcon },
    { text: 'service@mma.org.mo', icon: MailIcon },
    { text: '(853) 6234 5678', icon: ChatRoundIcon },
  ];

  return (
    <section className="relative flex-1 overflow-hidden rounded-[12px] border border-[#dbe6e4] bg-white/82 p-5 shadow-[0_10px_24px_rgba(42,72,76,0.12)] backdrop-blur-xl">
      <h2 className="text-[18px] font-bold text-[#004f46]">有疑问？联系专属服务团队</h2>
      <p className="mt-3 text-[13px] text-[#637477]">服务时间：周一至周五 09:00 - 18:00</p>
      <div className="relative z-10 mt-4 space-y-2 text-[13px] font-medium text-[#53676a]">
        {contacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <p className="flex items-center gap-2" key={contact.text}>
              <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#2c937b] text-white">
                <Icon />
              </span>
              {contact.text}
            </p>
          );
        })}
      </div>
      <img
        alt=""
        className="absolute bottom-0 right-0 h-[128px] w-[205px] select-none object-contain object-bottom opacity-34"
        draggable="false"
        src="/member-contact-building.png"
      />
    </section>
  );
}

export default function MemberPage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    getMyProfile().then(data => setProfile(data.member)).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fbf9] bg-[radial-gradient(circle_at_80%_0%,rgba(224,241,238,0.55),transparent_36%)] pl-[240px] text-[#004f46]">
      <MemberSidebar onViewProfile={() => setShowProfileModal(true)} onShowBenefits={() => setShowBenefits(true)} />
      <MemberTopBar
        profile={profile}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        dropdownRef={dropdownRef}
        onLogout={logout}
      />
      <div className="w-full px-3 pb-8">
        <MemberHero profile={profile} onUpdateProfile={() => setShowUpdateModal(true)} />
        <div className="mt-4 grid grid-cols-[1fr_380px] items-stretch gap-4">
          <div className="flex h-full flex-col gap-4">
            <div className="grid grid-cols-[1fr_344px] gap-4">
              <RecentUpdates />
              <AssistantMini />
            </div>
            <Recommendations />
          </div>
          <div className="flex h-full flex-col gap-4">
            <TrustCard />
            <ServicesCard />
            <ContactCard />
          </div>
        </div>
      </div>
          {showProfileModal && (
        <ProfileViewModal profile={profile} onClose={() => setShowProfileModal(false)} />
      )}
      {showBenefits && (
        <BenefitsModal tier={profile?.tier} onClose={() => setShowBenefits(false)} />
      )}
      {showUpdateModal && (
        <UpdateProfileModal
          profile={profile}
          onClose={() => setShowUpdateModal(false)}
          onSaved={(updated) => setProfile(updated)}
        />
      )}
    </main>
  );
}
