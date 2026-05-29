import { useState } from "react";

const STATUS_MAP = {
  "待审核": { label: "待审核", color: "text-[#ad7b00]", bg: "bg-[#fff8e9]", desc: "您的申请已提交，正在等待审核" },
  "初审通过": { label: "初审通过", color: "text-[#006252]", bg: "bg-[#e7f5f0]", desc: "初审已通过，等待终审" },
  "初审不通过": { label: "初审不通过", color: "text-[#c53030]", bg: "bg-[#fef0f0]", desc: "初审未通过，可修改后重新提交" },
  "终审通过": { label: "终审通过", color: "text-[#006252]", bg: "bg-[#e7f5f0]", desc: "终审已通过，请完成缴费" },
  "终审不通过": { label: "终审不通过", color: "text-[#c53030]", bg: "bg-[#fef0f0]", desc: "终审未通过，30天后可重新申请" },
  "待缴费": { label: "待缴费", color: "text-[#ad7b00]", bg: "bg-[#fff8e9]", desc: "审核已通过，请尽快完成缴费" },
  "已缴费": { label: "已缴费", color: "text-[#006252]", bg: "bg-[#e7f5f0]", desc: "缴费已提交，等待确认" },
  "已入会": { label: "已入会", color: "text-[#006252]", bg: "bg-[#e7f5f0]", desc: "恭喜！您已是正式会员" },
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.3-4.3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

export default function TrackPage() {
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadDone, setUploadDone] = useState(false);

  async function handleQuery(e) {
    e.preventDefault();
    const trimmed = idNumber.trim();
    if (trimmed.length < 15) {
      setError("请输入有效的证件号码（15-18位）");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/v1/applications?id_number=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error("查询失败");
      const data = await res.json();
      if (!data.items || data.items.length === 0) {
        setError("未找到该证件号码对应的申请记录");
      } else {
        const item = data.items[0];
        if (item.status) item.status = item.status.replace(/\u5be9/g, '\u5ba1');
        setResult(item);
      }
    } catch (err) {
      setError(err.message || "网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(appId) {
    if (!uploadFile) return;
    setUploading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      const res = await fetch(`/v1/applications/${appId}/payment-proof`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("上传失败");
      const data = await res.json();
      setUploadMsg("缴费凭证已提交，等待审核");
      setUploadDone(true);
      setUploadFile(null);
      // Refresh result
      setResult(prev => ({ ...prev, status: "已缴费", payment_proof_url: data.payment_proof_url }));
    } catch (e) {
      setUploadMsg(e.message || "上传失败");
    } finally {
      setUploading(false);
    }
  }

  const statusInfo = result ? STATUS_MAP[result.status] || { label: result.status, color: "text-[#57696d]", bg: "bg-[#e5eceb]", desc: "" } : null;

  return (
    <main className="min-h-screen bg-[#f8fbfb] bg-[url('/macau-page-bg.webp')] bg-cover bg-top bg-no-repeat pb-10">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 h-[78px] w-full rounded-b-[10px] bg-[linear-gradient(110deg,#003d36_0%,#005548_45%,#00483f_100%)] px-[42px] text-white shadow-[0_12px_30px_rgba(0,45,40,0.24)]">
        <div className="mx-auto flex h-full max-w-[900px] items-center justify-between">
          <a className="flex items-center gap-3 text-[16px] font-medium text-white/92 transition hover:text-white" href="/">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path d="m4 11 8-7 8 7v8a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
            返回首页
          </a>
          <h1 className="text-[22px] font-bold tracking-[0.05em]">入会进度查询</h1>
          <span className="w-[80px]" />
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-[600px] px-4">
        <div className="rounded-[14px] border border-[#dde7e5] bg-white/90 px-8 py-8 shadow-[0_16px_34px_rgba(35,70,74,0.13)] backdrop-blur-xl">
          <h2 className="text-center text-[20px] font-bold text-[#142528]">查询申请进度</h2>
          <p className="mt-2 text-center text-[14px] text-[#6a7679]">输入您申请时使用的证件号码</p>

          <form onSubmit={handleQuery} className="mt-6">
            <div className="flex gap-3">
              <input
                className="flex-1 rounded-[7px] border border-[#cfd9d7] bg-white px-4 py-3 text-[15px] font-medium text-[#1b292b] placeholder:text-[#a0acaf] focus:outline-none focus:ring-2 focus:ring-[#006252]/30"
                placeholder="身份证 / 护照号码"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                maxLength={18}
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-[48px] w-[100px] items-center justify-center gap-2 rounded-[7px] bg-gradient-to-br from-[#00836f] to-[#006252] text-[16px] font-bold text-white shadow-[0_6px_14px_rgba(0,93,80,0.24)] disabled:opacity-60"
              >
                <SearchIcon />
                {loading ? "查询中" : "查询"}
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-5 text-center text-[14px] font-medium text-red-500">{error}</p>
          )}

          {result && statusInfo && (
            <div className="mt-6 rounded-[9px] border border-[#d4e8e3] bg-[#f8fbfb] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-[#6a7679]">当前状态</span>
                <span className={`rounded-[6px] px-4 py-1.5 text-[14px] font-bold ${statusInfo.bg} ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="mt-3 text-[14px] text-[#57696d]">{statusInfo.desc}</p>

              <div className="mt-4 space-y-2 border-t border-[#dde7e5] pt-4 text-[13px] text-[#6a7679]">
                <div className="flex justify-between">
                  <span>申请人</span>
                  <span className="font-medium text-[#27383a]">{result.applicant_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>申请时间</span>
                  <span className="font-medium text-[#27383a]">
                    {result.submitted_at ? new Date(result.submitted_at).toLocaleString("zh-CN") : "-"}
                  </span>
                </div>
                {result.requested_tier && (
                  <div className="flex justify-between">
                    <span>申请级别</span>
                    <span className="font-medium text-[#27383a]">{result.requested_tier}</span>
                  </div>
                )}
              </div>
              {(result.status === "初审不通过" || result.status === "终审不通过") && (
                <div className="mt-4 rounded-[7px] border border-[#f5d0d0] bg-[#fff5f5] p-3">
                  <p className="text-[13px] font-semibold text-[#c53030]">驳回理由</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#8b3a3a]">
                    {result.final_review_result || result.screening_result || "无"}
                  </p>
                </div>
              )}
              {result.payment_reject_reason && (
                <div className="mt-4 rounded-[7px] border border-[#f5d0d0] bg-[#fff5f5] p-3">
                  <p className="text-[13px] font-semibold text-[#c53030]">缴费驳回理由</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#8b3a3a]">
                    {result.payment_reject_reason}
                  </p>
                </div>
              )}
              {result.status === "待缴费" && !uploadDone && (
                <div className="mt-4 rounded-[7px] border border-[#d4e8e3] bg-[#f4faf7] p-4">
                  <p className="text-[13px] font-semibold text-[#004f46]">提交缴费凭证</p>
                  <p className="mt-1 text-[12px] text-[#6a7679]">请上传缴费截图或转账记录</p>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      className="flex-1 rounded-[6px] border border-[#cfd9d7] bg-white px-3 py-2 text-[13px] file:mr-3 file:rounded-[4px] file:border-0 file:bg-[#e7f5f0] file:px-3 file:py-1 file:text-[12px] file:font-medium file:text-[#006252]"
                    />
                    <button
                      onClick={() => handleUpload(result.id)}
                      disabled={!uploadFile || uploading}
                      className="shrink-0 rounded-[6px] bg-gradient-to-br from-[#00836f] to-[#006252] px-4 py-2 text-[13px] font-bold text-white disabled:opacity-50"
                    >
                      {uploading ? "上传中..." : "提交"}
                    </button>
                  </div>
                  {uploadMsg && (
                    <p className="mt-2 text-[12px] font-medium text-[#006252]">{uploadMsg}</p>
                  )}
                </div>
              )}
              {result.status === "已缴费" && (
                <div className="mt-4 rounded-[7px] border border-[#d4e8e3] bg-[#e7f5f0] p-3 text-center">
                  <p className="text-[13px] font-semibold text-[#006252]">✓ 缴费凭证已提交，等待审核</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
