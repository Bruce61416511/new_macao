import { useState, useEffect, useCallback } from "react";

const API = "/v1/events";

export default function EventCenterPage({ role }) {
  const isRoot = role === "root";
  const [events, setEvents] = useState([]);
  const [myEventIds, setMyEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", event_date: "", location: "", description: "", price_normal: 0, max_participants: "" });
  const [msg, setMsg] = useState("");

  const token = sessionStorage.getItem("token");
  const isLoggedIn = !!token;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [evRes, myRes] = await Promise.all([
        fetch(API),
        token ? fetch(API + "/my", { headers: authHeaders }) : Promise.resolve(null)
      ]);
      if (evRes.ok) {
        const data = await evRes.json();
        const items = data.items || [];
        items.sort((a, b) => {
          const aOpen = a.registration_status === "开放";
          const bOpen = b.registration_status === "开放";
          if (aOpen && !bOpen) return -1;
          if (!aOpen && bOpen) return 1;
          return new Date(a.event_date) - new Date(b.event_date);
        });
        setEvents(isLoggedIn ? items : items.filter(e => e.registration_status === "开放"));
      }
      if (myRes && myRes.ok) {
        const myData = await myRes.json();
        const ids = new Set((myData.items || []).map(e => e.id));
        setMyEventIds(ids);
      }
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleRegister(eventId) {
    try {
      const res = await fetch(`${API}/${eventId}/register`, { method: "POST", headers: { ...authHeaders } });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.detail || "报名失败"); }
      setMsg("报名成功！");
      setMyEventIds(prev => new Set([...prev, eventId]));
      fetchData();
    } catch (e) { setMsg(e.message); }
  }

  async function handleCancel(eventId) {
    try {
      const res = await fetch(`${API}/${eventId}/register`, { method: "DELETE", headers: { ...authHeaders } });
      if (!res.ok) throw new Error("取消失败");
      setMsg("已取消报名");
      setMyEventIds(prev => { const next = new Set(prev); next.delete(eventId); return next; });
      fetchData();
    } catch (e) { setMsg(e.message); }
  }

  async function handleDelete(eventId) {
    if (!confirm("确认删除该活动？")) return;
    try {
      const res = await fetch(`${API}/${eventId}`, { method: "DELETE", headers: { ...authHeaders } });
      if (!res.ok) throw new Error("删除失败");
      setMsg("活动已删除"); fetchData();
    } catch (e) { setMsg(e.message); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const body = { ...form, max_participants: form.max_participants ? parseInt(form.max_participants) : null, price_normal: parseInt(form.price_normal) || 0 };
      const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(typeof d.detail === "object" ? d.detail.message : d.detail || "创建失败"); }
      setMsg("活动创建成功！"); setShowCreate(false); setForm({ title: "", event_date: "", location: "", description: "", price_normal: 0, max_participants: "" }); fetchData();
    } catch (e) { setMsg(e.message); }
  }

  return (
    <div className="min-h-screen bg-[#f8fbf9] pl-[240px]">
      <header className="sticky top-0 z-30 flex h-[96px] items-center justify-between bg-white/72 px-11 backdrop-blur-xl">
        <h1 className="font-serifCn text-[34px] font-semibold leading-none text-[#00473f]">协会活动</h1>
        <a href="/member" className="text-[14px] font-medium text-[#006252]">← 返回会员中心</a>
      </header>
      <div className="px-11 py-6 max-w-[1200px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold text-[#142528]">{isRoot ? "活动管理" : "可报名活动"}</h2>
          {isRoot && (<button onClick={() => setShowCreate(true)} className="rounded-[7px] bg-gradient-to-br from-[#00836f] to-[#006252] px-5 py-2.5 text-[14px] font-bold text-white">+ 创建活动</button>)}
        </div>
        {msg && <p className="mb-4 text-center text-[14px] font-medium text-[#006252] bg-[#e7f5f0] py-2 rounded-[6px]">{msg}</p>}
        {loading ? (<p className="text-center text-[#9ba8aa] py-10">加载中...</p>) : events.length === 0 ? (<p className="text-center text-[#9ba8aa] py-10">暂无活动</p>) : (
          <div className="grid gap-4">
            {events.map(event => (
              <div key={event.id} className="rounded-[10px] border border-[#dde7e5] bg-white p-5 shadow-sm flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[16px] font-bold text-[#142528]">{event.title}</h3>
                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${event.registration_status === "开放" ? "bg-[#e7f5f0] text-[#006252]" : "bg-[#fef0f0] text-[#c53030]"}`}>{event.registration_status}</span>
                  </div>
                  <div className="mt-2 flex gap-6 text-[13px] text-[#6a7679]">
                    <span>🕐 {event.event_date ? new Date(event.event_date).toLocaleString("zh-CN") : "-"}</span>
                    <span>📍 {event.location}</span>
                    <span>💰 {event.price_normal > 0 ? `${event.price_normal} 澳门元` : "免费"}</span>
                    <span>👥 {event.registrations_count || 0}{event.max_participants ? ` / ${event.max_participants}` : ""}</span>
                  </div>
                  {event.description && <p className="mt-1 text-[13px] text-[#9ba8aa]">{event.description}</p>}
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {isRoot ? (
                    <button onClick={() => handleDelete(event.id)} className="text-[13px] font-medium text-red-500 hover:text-red-600">删除</button>
                  ) : !isLoggedIn ? (
                    <a href="/login" className="rounded-[6px] border border-[#006252] px-4 py-2 text-[13px] font-medium text-[#006252]">请登录</a>
                  ) : myEventIds.has(event.id) ? (
                    <button onClick={() => handleCancel(event.id)} className="rounded-[6px] border border-[#cfd9d7] px-4 py-2 text-[13px] font-medium text-[#6a7679]">取消报名</button>
                  ) : event.registration_status === "开放" ? (
                    <button onClick={() => handleRegister(event.id)} className="rounded-[6px] bg-[#006252] px-4 py-2 text-[13px] font-bold text-white">报名</button>
                  ) : (
                    <span className="text-[13px] text-[#9ba8aa]">截止</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
            <div className="w-full max-w-[480px] rounded-[12px] border border-[#dde7e5] bg-white p-6 shadow-[0_20px_50px_rgba(35,70,74,0.25)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[18px] font-bold text-[#142528]">创建活动</h2>
                <button onClick={() => setShowCreate(false)} className="text-[20px] text-[#9ba8aa]">×</button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <Field label="活动标题" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} required />
                <Field label="活动时间" type="datetime-local" value={form.event_date} onChange={v => setForm(p => ({ ...p, event_date: v }))} required />
                <Field label="地点" value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))} required />
                <Field label="描述" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} />
                <Field label="价格(澳门元)" type="number" value={form.price_normal} onChange={v => setForm(p => ({ ...p, price_normal: v }))} />
                <Field label="人数上限" type="number" value={form.max_participants} onChange={v => setForm(p => ({ ...p, max_participants: v }))} />
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="rounded-[6px] border border-[#cfd9d7] px-5 py-2 text-[14px] text-[#6a7679]">取消</button>
                  <button type="submit" className="rounded-[6px] bg-gradient-to-br from-[#00836f] to-[#006252] px-5 py-2 text-[14px] font-bold text-white">创建</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required }) {
  return (
    <div>
      <label className="block mb-1 text-[13px] font-semibold text-[#27383a]">{label}</label>
      <input
        type={type}
        className="w-full rounded-[6px] border border-[#cfd9d7] bg-white px-3 py-2 text-[14px] text-[#1b292b] focus:outline-none focus:ring-2 focus:ring-[#006252]/30"
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
