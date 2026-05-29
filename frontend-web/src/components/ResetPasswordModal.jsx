import { useState } from "react";

export default function ResetPasswordModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!username.trim()) { setError("请输入用户名"); return; }
    if (!idNumber.trim()) { setError("请输入身份证号"); return; }
    if (!newPassword || newPassword.length < 6) { setError("新密码至少6位"); return; }
    if (newPassword !== confirmPassword) { setError("两次密码不一致"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_number: idNumber.trim(), new_password: newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || "重置失败");
      }
      setMessage("密码重置成功，请使用新密码登录");
      setIdNumber("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[400px] rounded-[16px] border border-[#dce6e4] bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[#004f46]">重置密码</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-[#8ba09c] hover:bg-[#f2f6f5] hover:text-[#004f46] transition" type="button">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <p className="mb-4 text-[13px] leading-relaxed text-[#6c777b]">
          请输入您入会时登记的身份证号，即可重置登录密码。理事账号不支持此方式重置。
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="mb-1 block text-[13px] font-medium text-[#6b5e58]">用户名</label>
            <input
              className="w-full rounded-[10px] border border-[#dce6e4] bg-[#fdfcfa] px-4 py-2.5 text-[14px] outline-none transition focus:border-[#00836f] focus:bg-white"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-[13px] font-medium text-[#6b5e58]">身份证号</label>
            <input
              className="w-full rounded-[10px] border border-[#dce6e4] bg-[#fdfcfa] px-4 py-2.5 text-[14px] outline-none transition focus:border-[#00836f] focus:bg-white"
              placeholder="请输入身份证号"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-[13px] font-medium text-[#6b5e58]">新密码</label>
            <input
              className="w-full rounded-[10px] border border-[#dce6e4] bg-[#fdfcfa] px-4 py-2.5 text-[14px] outline-none transition focus:border-[#00836f] focus:bg-white"
              type="password"
              placeholder="至少6位"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-[13px] font-medium text-[#6b5e58]">确认密码</label>
            <input
              className="w-full rounded-[10px] border border-[#dce6e4] bg-[#fdfcfa] px-4 py-2.5 text-[14px] outline-none transition focus:border-[#00836f] focus:bg-white"
              type="password"
              placeholder="再次输入新密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full rounded-[24px] bg-gradient-to-br from-[#00836f] to-[#006252] py-3 text-[15px] font-medium text-white shadow-[0_4px_16px_rgba(0,93,80,0.25)] transition hover:shadow-[0_6px_20px_rgba(0,93,80,0.35)] disabled:opacity-60"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "重置中..." : "确认重置"}
          </button>

          {error && (
            <div className="mt-3 rounded-[10px] bg-[#fdf0eb] px-4 py-2.5 text-center text-[13px] text-[#c86a4a]">
              {error}
            </div>
          )}
          {message && (
            <div className="mt-3 rounded-[10px] bg-[#e7f5f0] px-4 py-2.5 text-center text-[13px] text-[#006252]">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
