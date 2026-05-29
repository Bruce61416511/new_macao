import React, { useState, useEffect } from "react";

const MEMBERS_API = "/v1/admin/members";
const APPS_API = "/v1/admin/members/applications";

export default function MemberManagementPage() {
  const [members, setMembers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;

  const token = sessionStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  async function fetchData(p = page) {
    setLoading(true);
    try {
      const [mRes, aRes] = await Promise.all([
        fetch(`${MEMBERS_API}?page=${p}&page_size=${pageSize}`, { headers: authHeaders }),
        fetch(APPS_API, { headers: authHeaders }),
      ]);
      if (mRes.ok) {
        const data = await mRes.json();
        setMembers(data.items || []);
        setTotal(data.total || 0);
      }
      if (aRes.ok) {
        const data = await aRes.json();
        const appsData = data.items || [];
        appsData.forEach(a => { if (a.status) a.status = a.status.replace(/\u5be9/g, '\u5ba1'); });
        setApplications(appsData);
      }
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  function openEdit(member) {
    setEditTarget(member.id);
    setEditForm({
      username: member.username || "",
      real_name: member.real_name || "",
      phone: member.phone || "",
      email: member.email || "",
      tier: member.tier || "",
      annual_fee: member.annual_fee ?? 0,
      is_active: member.is_active,
      address: member.address || "",
      career_history: member.career_history || "",
      qualifications: member.qualifications || "",
      qualification_files: member.qualification_files || "",
    });
  }

  function updateField(field, value) {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    try {
      const res = await fetch(`${MEMBERS_API}/${editTarget}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "保存失败");
      }
      setMsg("保存成功");
      setEditTarget(null);
      fetchData();
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function handleDelete(memberId) {
    if (!confirm("确认删除该会员？此操作不可恢复。")) return;
    try {
      const res = await fetch(`${MEMBERS_API}/${memberId}`, { method: "DELETE", headers: authHeaders });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "删除失败");
      }
      setMsg("已删除");
      fetchData();
    } catch (e) {
      setMsg(e.message);
    }
  }

  // Cross-reference members with their latest application status
  const memberAppStatus = {};
  applications.forEach(a => {
    const mid = a.member_id;
    const uname = (a.username || "").replace(/_upd_\d+$/, "");
    const idnum = (a.id_number || "").replace(/_upd_\d+$/, "");
    if (mid) memberAppStatus[mid] = a.status.replace(/\u5be9/g, '\u5ba1');
    members.forEach(m => {
      if (!memberAppStatus[m.id] && (m.username === uname || m.id_number === idnum || (m.id_number || "").replace(/_upd_\d+$/, "") === idnum)) {
        memberAppStatus[m.id] = a.status.replace(/\u5be9/g, '\u5ba1');
      }
    });
  });
  const membersWithStatus = members.map(m => ({
    ...m,
    _appStatus: memberAppStatus[m.id] || null,
  }));
  // Group members by application status
  const memberGroups = {};
  membersWithStatus.forEach(m => {
    const key = m._appStatus || "无申请记录";
    if (!memberGroups[key]) memberGroups[key] = [];
    memberGroups[key].push(m);
  });

  const pendingApps = applications.filter(a => a.status === "初审通过" || a.status === "终审通过");
  const initialRejectedApps = applications.filter(a => a.status === "初审不通过");
  const finalRejectedApps = applications.filter(a => a.status === "终审不通过");
  
  const truncate = (s, n) => s && s.length > n ? s.slice(0, n) + "..." : s || "-";

  function parseFiles(raw) {
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return [raw]; }
  }
  const BACKEND = "http://localhost:8000";
function statusBadge(status) {
    const colors = {
      "初审通过": "bg-[#fef9e7] text-[#b7950b]",
      "终审通过": "bg-[#e7f5f0] text-[#006252]",
      "初审不通过": "bg-[#fef0f0] text-[#c53030]",
      "终审不通过": "bg-[#fef0f0] text-[#c53030]",
      "已入会": "bg-[#e7f5f0] text-[#006252]",
    };
    return colors[status] || "bg-[#f2f5f4] text-[#6a7679]";
  }

  function MemberTable({ members, showStatus = true }) {
    return (
      <div className="overflow-x-auto rounded-[10px] border border-[#dde7e5] bg-white shadow-sm">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[#f4f8f7] text-left text-[#4a5c5f] font-semibold">
              <th className="px-4 py-3">用户名</th>
              <th className="px-4 py-3">姓名</th>
              <th className="px-4 py-3">身份证</th>
              <th className="px-4 py-3">手机</th>
              <th className="px-4 py-3">邮箱</th>
              <th className="px-4 py-3">等级</th>
              <th className="px-4 py-3">年费</th>
              {showStatus && <th className="px-4 py-3">状态</th>}
              <th className="px-4 py-3">入会时间</th>
              <th className="px-4 py-3">从业经历</th>
              <th className="px-4 py-3">资质</th>
              <th className="px-4 py-3">资质文件</th>
              <th className="px-4 py-3 w-[140px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className="border-t border-[#eef3f1] hover:bg-[#f9fbfa]">
                <td className="px-4 py-3 text-[#142528]">{m.username}</td>
                <td className="px-4 py-3 text-[#142528]">{m.real_name || m.applicant_name || "-"}</td>
                <td className="px-4 py-3 text-[#6a7679] text-[12px]">{m.id_number || "-"}</td>
                <td className="px-4 py-3 text-[#6a7679]">{m.phone || m.applicant_phone || "-"}</td>
                <td className="px-4 py-3 text-[#6a7679]">{m.email || m.applicant_email || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${
                    (m.tier || m.requested_tier) === "root" ? "bg-[#fef0f0] text-[#c53030]" :
                    (m.tier || m.requested_tier) === "理事" ? "bg-[#fef9e7] text-[#b7950b]" :
                    "bg-[#e7f5f0] text-[#006252]"
                  }`}>{m.tier || m.requested_tier || "-"}</span>
                </td>
                <td className="px-4 py-3 text-[#6a7679]">{m.annual_fee === 0 ? "永久" : (m.annual_fee || "-")}</td>
                {showStatus && (
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${m._derivedActive ? "bg-[#e7f5f0] text-[#006252]" : "bg-[#fef0f0] text-[#c53030]"}`}>
                      {m._derivedActive ? "在籍" : "停用"}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-[#9ba8aa] text-[12px]">{m.created_at ? new Date(m.created_at).toLocaleDateString("zh-CN") : "-"}</td>
                <td className="px-4 py-3 text-[#6a7679] text-[12px] max-w-[140px] truncate" title={m.career_history}>{truncate(m.career_history, 15)}</td>
                <td className="px-4 py-3 text-[#6a7679] text-[12px] max-w-[140px] truncate" title={m.qualifications}>{truncate(m.qualifications, 15)}</td>
                <td className="px-4 py-3 text-[12px]">{(() => { const files = parseFiles(m.qualification_files); return files.length > 0 ? files.map((f, i) => React.createElement("a", { key: i, href: BACKEND + f, target: "_blank", className: "text-[#006252] hover:underline mr-2" }, "附件" + (i+1))) : "-"; })()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(m)} className="text-[13px] font-medium text-[#006252] hover:underline">编辑</button>
                    <button onClick={() => handleDelete(m.id)} className="text-[13px] font-medium text-red-500 hover:underline">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function AppTable({ apps }) {
    return (
      <div className="overflow-x-auto rounded-[10px] border border-[#dde7e5] bg-white shadow-sm">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[#f4f8f7] text-left text-[#4a5c5f] font-semibold">
              <th className="px-4 py-3">用户名</th>
              <th className="px-4 py-3">申请人</th>
              <th className="px-4 py-3">身份证</th>
              <th className="px-4 py-3">电话</th>
              <th className="px-4 py-3">申请等级</th>
              <th className="px-4 py-3">从业经历</th>
              <th className="px-4 py-3">资质</th>
              <th className="px-4 py-3">资质文件</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">提交时间</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(a => (
              <tr key={a.id} className="border-t border-[#eef3f1] hover:bg-[#f9fbfa]">
                <td className="px-4 py-3 text-[#142528]">{a.username}</td>
                <td className="px-4 py-3 text-[#142528]">{a.applicant_name || "-"}</td>
                <td className="px-4 py-3 text-[#6a7679] text-[12px]">{a.id_number || "-"}</td>
                <td className="px-4 py-3 text-[#6a7679]">{a.applicant_phone || "-"}</td>
                <td className="px-4 py-3 text-[#6a7679]">{a.requested_tier || "-"}</td>
                <td className="px-4 py-3 text-[#6a7679] text-[12px] max-w-[140px] truncate" title={a.career_history}>{truncate(a.career_history, 15)}</td>
                <td className="px-4 py-3 text-[#6a7679] text-[12px] max-w-[140px] truncate" title={a.qualifications}>{truncate(a.qualifications, 15)}</td>
                <td className="px-4 py-3 text-[12px]">{(() => { const files = parseFiles(a.qualification_files); return files.length > 0 ? files.map((f, i) => React.createElement("a", { key: i, href: BACKEND + f, target: "_blank", className: "text-[#006252] hover:underline mr-2" }, "附件" + (i+1))) : "-"; })()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${statusBadge(a.status)}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3 text-[#9ba8aa] text-[12px]">{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString("zh-CN") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const STATUS_DISPLAY = {
  "初审通过": "初审通过",
  "初审不通过": "初审不通过",
  "终审通过": "终审通过",
  "终审不通过": "终审不通过",
  "待审核": "待审核",
};
function statusDisplay(s) { return STATUS_DISPLAY[s] || s; }

function Section({ title, badge, count, children }) {
    return (
      <div className="mb-6">
        <h3 className="text-[16px] font-bold text-[#142528] mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-[13px] ${badge}`}>{statusDisplay(title)}</span>
          <span className="ml-2 text-[14px] text-[#6a7679] font-normal">共 {count} 人</span>
        </h3>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbf9] pl-[240px]">
      <header className="sticky top-0 z-30 flex h-[96px] items-center justify-between bg-white/72 px-11 backdrop-blur-xl">
        <h1 className="font-serifCn text-[34px] font-semibold leading-none text-[#00473f]">会员管理</h1>
        <a href="/member" className="text-[14px] font-medium text-[#006252]">← 返回会员中心</a>
      </header>
      <div className="px-11 py-6">
        {msg && <p className="mb-4 text-center text-[14px] font-medium text-[#006252] bg-[#e7f5f0] py-2 rounded-[6px]">{msg}</p>}

        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] text-[#6a7679]">会员 {total} 名，申请 {applications.filter(a => a.status !== "已入会").length} 条</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => { setPage(p => p - 1); fetchData(page - 1); }} className="rounded-[6px] border border-[#cfd9d7] px-4 py-1.5 text-[13px] text-[#6a7679] disabled:opacity-40">上一页</button>
            <span className="px-3 py-1.5 text-[13px] text-[#6a7679]">第 {page} 页</span>
            <button disabled={page * pageSize >= total} onClick={() => { setPage(p => p + 1); fetchData(page + 1); }} className="rounded-[6px] border border-[#cfd9d7] px-4 py-1.5 text-[13px] text-[#6a7679] disabled:opacity-40">下一页</button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-[#9ba8aa] py-10">加载中...</p>
        ) : (
          <>
            {Object.entries(memberGroups).map(([status, groupMembers]) => {
              const isOk = status === "已入会";
              const isBad = status === "终审不通过" || status === "初审不通过";
              const badgeColor = isOk ? "text-[#006252] bg-[#e7f5f0]" : isBad ? "text-[#c53030] bg-[#fef0f0]" : "text-[#b7950b] bg-[#fef9e7]";
              return (
                <Section key={status} title={status} badge={badgeColor} count={groupMembers.length}>
                  <MemberTable members={groupMembers} showStatus={false} />
                </Section>
              );
            })}
            {pendingApps.length > 0 && (
              <Section title={"待处理申请"} badge="text-[#b7950b] bg-[#fef9e7]" count={pendingApps.length}>
                <AppTable apps={pendingApps} />
              </Section>
            )}
            {initialRejectedApps.length > 0 && (
              <Section title={"初审不通过"} badge="text-[#e67e22] bg-[#fef5ec]" count={initialRejectedApps.length}>
                <AppTable apps={initialRejectedApps} />
              </Section>
            )}
            {finalRejectedApps.length > 0 && (
              <Section title={"终审不通过"} badge="text-[#c53030] bg-[#fef0f0]" count={finalRejectedApps.length}>
                <AppTable apps={finalRejectedApps} />
              </Section>
            )}
                        {membersWithStatus.length === 0 && applications.length === 0 && (
              <p className="text-center text-[#9ba8aa] py-10">暂无数据</p>
            )}
          </>
        )}

        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEditTarget(null)}>
            <div className="w-full max-w-[600px] max-h-[85vh] overflow-y-auto rounded-[12px] border border-[#dde7e5] bg-white p-6 shadow-[0_20px_50px_rgba(35,70,74,0.25)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[18px] font-bold text-[#142528]">编辑会员</h2>
                <button onClick={() => setEditTarget(null)} className="text-[20px] text-[#9ba8aa]">×</button>
              </div>
              <div className="space-y-3">
                <Field label={"用户名"} value={editForm.username} onChange={v => updateField("username", v)} />
                <Field label={"姓名"} value={editForm.real_name} onChange={v => updateField("real_name", v)} />
                <Field label={"手机"} value={editForm.phone} onChange={v => updateField("phone", v)} />
                <Field label={"邮箱"} value={editForm.email} onChange={v => updateField("email", v)} />
                <Field label={"等级"} value={editForm.tier} onChange={v => updateField("tier", v)} />
                <div>
                  <label className="block mb-1 text-[13px] font-semibold text-[#27383a]">年费 (0=永久)</label>
                  <input type="number" className="w-full rounded-[6px] border border-[#cfd9d7] bg-white px-3 py-2 text-[14px]" value={editForm.annual_fee} onChange={e => updateField("annual_fee", parseInt(e.target.value) || 0)} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[13px] font-semibold text-[#27383a]">状态</label>
                  <select className="rounded-[6px] border border-[#cfd9d7] bg-white px-3 py-2 text-[14px]" value={editForm.is_active ? "true" : "false"} onChange={e => updateField("is_active", e.target.value === "true")}>
                    <option value="true">在籍</option>
                    <option value="false">停用</option>
                  </select>
                </div>
                <Field label={"地址"} value={editForm.address} onChange={v => updateField("address", v)} />
                <div>
                  <label className="block mb-1 text-[13px] font-semibold text-[#27383a]">从业经历</label>
                  <textarea className="w-full rounded-[6px] border border-[#cfd9d7] bg-white px-3 py-2 text-[14px] h-20 resize-none" value={editForm.career_history} onChange={e => updateField("career_history", e.target.value)} />
                </div>
                <div>
                  <label className="block mb-1 text-[13px] font-semibold text-[#27383a]">资质</label>
                  <textarea className="w-full rounded-[6px] border border-[#cfd9d7] bg-white px-3 py-2 text-[14px] h-20 resize-none" value={editForm.qualifications} onChange={e => updateField("qualifications", e.target.value)} />
                </div>
                <Field label={"资质文件"} value={editForm.qualification_files} onChange={v => updateField("qualification_files", v)} />
              </div>
              <div className="flex gap-3 justify-end mt-5 pt-3 border-t border-[#eef3f1]">
                <button onClick={() => setEditTarget(null)} className="rounded-[6px] border border-[#cfd9d7] px-5 py-2 text-[14px] text-[#6a7679]">取消</button>
                <button onClick={handleSave} className="rounded-[6px] bg-gradient-to-br from-[#00836f] to-[#006252] px-5 py-2 text-[14px] font-bold text-white">保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 text-[13px] font-semibold text-[#27383a]">{label}</label>
      <input
        type={type}
        className="w-full rounded-[6px] border border-[#cfd9d7] bg-white px-3 py-2 text-[14px] text-[#1b292b] focus:outline-none focus:ring-2 focus:ring-[#006252]/30"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
