import React from "react";

const benefits = {
  "普通会员": [
    { title: "协会活动报名", desc: "参加各类协会主办的活动", icon: "📅" },
    { title: "基础培训课程", desc: "免费参加基础培训课程", icon: "📚" },
    { title: "行业资讯", desc: "定期推送行业动态和政策信息", icon: "📨" },
    { title: "会员证书", desc: "获得电子会员证书", icon: "🏅" },
  ],
  "高级会员": [
    { title: "优先报名", desc: "活动名额优先保留", icon: "⭐" },
    { title: "高级培训", desc: "专属高级培训课程", icon: "🎓" },
    { title: "商务对接", desc: "企业资源精准匹配", icon: "🤝" },
    { title: "活动报名", desc: "参加各类协会活动", icon: "📅" },
    { title: "培训课程", desc: "基础与进阶培训", icon: "📚" },
    { title: "行业资讯", desc: "定期行业报告与分析", icon: "📨" },
  ],
  "理事": [
    { title: "协会决策", desc: "参与协会重大事项表决", icon: "🏛️" },
    { title: "专属顾问", desc: "一对一专属服务顾问", icon: "💼" },
    { title: "品牌推广", desc: "协会平台品牌曝光资源", icon: "📣" },
    { title: "优先报名", desc: "所有活动无条件优先", icon: "⭐" },
    { title: "高级培训", desc: "全部培训课程免费", icon: "🎓" },
    { title: "商务对接", desc: "高端资源优先匹配", icon: "🤝" },
  ],
};

const tierNames = {
  "普通会员": "普通会员",
  "高级会员": "高级会员",
  "理事": "理事",
};

const tierColors = {
  "普通会员": "from-[#006252] to-[#00836f]",
  "高级会员": "from-[#b7950b] to-[#d4a017]",
  "理事": "from-[#7b2d8b] to-[#9b4dca]",
};

export default function BenefitsModal({ tier, onClose }) {
  const items = benefits[tier] || benefits["普通会员"];
  const tierName = tierNames[tier] || tier || "普通会员";
  const gradient = tierColors[tier] || tierColors["普通会员"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-[14px] border border-[#dde7e5] bg-white shadow-[0_20px_50px_rgba(35,70,74,0.25)]" onClick={e => e.stopPropagation()}>
        <div className={`bg-gradient-to-br ${gradient} px-6 py-8 rounded-t-[14px] text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] opacity-80">会员权益</p>
              <h2 className="text-[26px] font-bold mt-1">{tierName}</h2>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-[24px]">×</button>
          </div>
          <p className="mt-3 text-[14px] opacity-90">以下为您当前等级可享受的权益</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-[10px] border border-[#eef3f1] bg-[#f9fbfa] hover:shadow-sm transition">
                <span className="text-[28px] shrink-0">{item.icon}</span>
                <div>
                  <h3 className="text-[15px] font-bold text-[#142528]">{item.title}</h3>
                  <p className="text-[13px] text-[#6a7679] mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-[10px] bg-[#f4f8f7] border border-[#dde7e5]">
            <p className="text-[13px] font-semibold text-[#27383a]">权益说明</p>
            <ul className="mt-2 text-[13px] text-[#6a7679] space-y-1 list-disc list-inside">
              <li>会员权益仅限本人使用，不得转让</li>
              <li>部分活动可能涉及额外费用，以具体活动说明为准</li>
              <li>权益可能随协会政策调整，请以最新公告为准</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
