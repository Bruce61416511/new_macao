import React from "react";

const normalBenefits = [
  { title: "协会活动报名", desc: "参加各类协会主办的交流活动", icon: "📅" },
  { title: "基础培训课程", desc: "免费参加基础培训课程", icon: "📚" },
  { title: "行业资讯", desc: "定期推送行业动态和政策信息", icon: "📨" },
  { title: "会员证书", desc: "获得电子会员证书", icon: "🏅" },
];

const premiumBenefits = [
  { title: "优先报名", desc: "活动名额优先保留", icon: "⭐" },
  { title: "高级培训", desc: "专属高级培训课程", icon: "🎓" },
  { title: "商务对接", desc: "企业资源精准匹配", icon: "🤝" },
  { title: "全部活动", desc: "参加所有协会活动", icon: "📅" },
  { title: "全部培训", desc: "基础与进阶培训全包含", icon: "📚" },
  { title: "行业分析", desc: "定期行业报告与深度分析", icon: "📨" },
];

export default function PublicBenefitsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[860px] max-h-[85vh] overflow-y-auto rounded-[14px] border border-[#dde7e5] bg-white shadow-[0_20px_50px_rgba(35,70,74,0.25)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eef3f1]">
          <h2 className="text-[22px] font-bold text-[#142528]">会员权益</h2>
          <button onClick={onClose} className="text-[24px] text-[#9ba8aa] hover:text-[#142528]">×</button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-6">
          {/* Normal Tier */}
          <div>
            <div className="bg-gradient-to-br from-[#006252] to-[#00836f] rounded-[10px] px-5 py-4 text-white mb-4">
              <p className="text-[12px] opacity-75">年费 500 澳门元</p>
              <h3 className="text-[20px] font-bold">普通会员</h3>
            </div>
            <div className="space-y-3">
              {normalBenefits.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-[8px] border border-[#eef3f1] bg-[#f9fbfa]">
                  <span className="text-[22px] shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#142528]">{item.title}</h4>
                    <p className="text-[12px] text-[#6a7679] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Tier */}
          <div>
            <div className="bg-gradient-to-br from-[#b7950b] to-[#d4a017] rounded-[10px] px-5 py-4 text-white mb-4">
              <p className="text-[12px] opacity-75">年费 1000 澳门元</p>
              <h3 className="text-[20px] font-bold">高级会员</h3>
            </div>
            <div className="space-y-3">
              {premiumBenefits.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-[8px] border border-[#eef3f1] bg-[#f9fbfa]">
                  <span className="text-[22px] shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#142528]">{item.title}</h4>
                    <p className="text-[12px] text-[#6a7679] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <p className="text-[12px] text-[#9ba8aa] text-center">理事会员为协会核心成员，享有全部权益 + 协会决策参与权，详情请咨询协会秘书处。</p>
        </div>
      </div>
    </div>
  );
}
