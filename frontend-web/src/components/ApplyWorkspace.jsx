const chips = ['文化教育', '科技与互联网', '专业服务', '商贸及零售', '其它领域'];

const steps = [
  {
    title: '基本信息',
    desc: '完善机构/个人基本信息',
    status: '已完成',
    tone: 'done',
    icon: UserIcon,
  },
  {
    title: '从业经历',
    desc: '填写从业背景与主要方向',
    status: '待补充',
    tone: 'warn',
    icon: BriefcaseIcon,
  },
  {
    title: '资质文件',
    desc: '上传相关资质或证明材料',
    status: '已上传 2 份',
    tone: 'done',
    icon: FolderIcon,
  },
  {
    title: '声明与授权',
    desc: '阅读并确认声明与授权书',
    status: '未确认',
    tone: 'danger',
    icon: ShieldCheckIcon,
  },
];

const references = [
  {
    title: '《澳门特别行政区社团登记及运作指引》',
    source: '澳门特别行政区政府 社团事务局',
  },
  {
    title: '《非牟利社团章程范本（参考）》',
    source: '社团事务局 - 表格及指引',
  },
];

function SparkleIcon() {
  return (
    <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 32 32">
      <path d="M15 3.5 17.5 11 25 13.5 17.5 16 15 23.5 12.5 16 5 13.5 12.5 11z" fill="currentColor" />
      <path d="m25 3 1.3 3.7L30 8l-3.7 1.3L25 13l-1.3-3.7L20 8l3.7-1.3zM7 22l1.1 3.1L11 26l-2.9.9L7 30l-1.1-3.1L3 26l2.9-.9z" fill="currentColor" opacity=".85" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M4 9.5h4l5-4v13l-5-4H4z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M16 9a5 5 0 0 1 0 6M19 6.5a9 9 0 0 1 0 11" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="19" r="1.7" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg aria-hidden="true" className="h-[58px] w-[58px]" fill="none" viewBox="0 0 64 64">
      <path d="M24 48h19a13 13 0 0 0-2-25.8A17 17 0 0 0 8 28.5 10.5 10.5 0 0 0 24 48Z" fill="url(#uploadGradient)" />
      <path d="M32 44V23M23.5 31.5 32 23l8.5 8.5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
      <defs>
        <linearGradient id="uploadGradient" x1="12" x2="51" y1="17" y2="50">
          <stop stopColor="#75c3b7" />
          <stop offset="1" stopColor="#006252" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LotusAvatar() {
  return (
    <div className="grid h-[58px] w-[58px] shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#087765] to-[#005345] shadow-[0_8px_14px_rgba(0,79,70,0.22)]">
      <img alt="" className="h-[48px] w-[48px] rounded-full object-cover" src="/lotus-assistant.png" />
    </div>
  );
}

function UserIcon({ className = 'h-7 w-7' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.8" fill="currentColor" />
      <path d="M4.8 21c1-4.2 3.5-6.4 7.2-6.4s6.2 2.2 7.2 6.4" fill="currentColor" />
    </svg>
  );
}

function BriefcaseIcon({ className = 'h-7 w-7' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect height="13" rx="2" stroke="currentColor" strokeWidth="2" width="18" x="3" y="8" />
      <path d="M9 8V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V8M3 13h18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function FolderIcon({ className = 'h-7 w-7' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M3.5 7.5h6l2 2h9v9.5a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2z" fill="currentColor" />
      <path d="M8 15h8" stroke="#fff" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function ShieldCheckIcon({ className = 'h-7 w-7' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M12 3 20 6.5v5.8c0 5.1-2.9 8.6-8 10.7-5.1-2.1-8-5.6-8-10.7V6.5z" fill="currentColor" />
      <path d="m8.6 12 2.2 2.2 4.7-5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 text-[#006252]" fill="none" viewBox="0 0 24 24">
      <path d="M6 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M14 3.5v4h4M9 12h6M9 16h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M6 4h12v16H6z" stroke="currentColor" strokeWidth="2" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path d="M5 14v-2a7 7 0 0 1 14 0v2M5 14h3v5H6a1 1 0 0 1-1-1zM19 14h-3v5h2a1 1 0 0 0 1-1z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="M16 19c0 1.5-1.3 2-3 2h-1" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <path d="m8 13 5.8-5.8a3.2 3.2 0 0 1 4.5 4.5l-7.1 7.1a5 5 0 0 1-7.1-7.1l7.4-7.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <rect height="11" rx="4" stroke="currentColor" strokeWidth="2" width="7" x="8.5" y="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <path
        d="M4.7 11.6 19.6 4.8c.8-.4 1.6.4 1.2 1.2L14 20.9c-.4.9-1.7.8-2-.1l-1.8-6.1-5.5-1.4c-.9-.2-1-1.4 0-1.7Z"
        fill="currentColor"
      />
      <path d="m10.4 14.5 5.5-5.6" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function HintShieldIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 3.5 19 6.6v5.2c0 4.7-2.5 7.9-7 9.7-4.5-1.8-7-5-7-9.7V6.6z" fill="currentColor" />
      <path d="m9 12 2 2 4-4.3" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function LeftAssistantCard() {
  return (
    <section className="overflow-hidden rounded-[14px] border border-[#8fc6bf]/70 bg-white/80 shadow-[0_16px_34px_rgba(35,70,74,0.14)] backdrop-blur-xl">
      <header className="flex h-[83px] items-center justify-between border-b border-[#d8e4e2] px-[26px]">
        <div className="flex items-center gap-4">
          <SparkleIcon />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[22px] font-bold leading-none text-[#092b2d]">小扬同学 AI 助理</h2>
              <span className="rounded-full bg-[#dff2e9] px-3 py-1 text-[13px] font-semibold leading-none text-[#0b7665]">在线</span>
            </div>
            <p className="mt-2 text-[14px] font-medium text-[#6b777a]">由澳门社团与企业服务平台提供支持</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-[#163b3d]">
          <SoundIcon />
          <MoreIcon />
        </div>
      </header>

      <div className="px-[26px] py-[26px]">
        <div className="flex items-start gap-5">
          <LotusAvatar />
          <div className="relative rounded-[10px] bg-white px-[28px] py-[22px] shadow-[0_8px_22px_rgba(31,61,64,0.12)]">
            <span className="absolute left-[-8px] top-7 h-4 w-4 rotate-45 bg-white" />
            <p className="relative text-[18px] font-medium text-[#1d2f31]">请上传机构营业资料或相关证明</p>
            <p className="relative mt-5 text-[14px] font-medium text-[#8b9699]">10:15</p>
          </div>
        </div>

        <div className="ml-[74px] mt-5 rounded-[12px] bg-white p-3 shadow-[0_8px_24px_rgba(31,61,64,0.12)]">
          <div className="grid h-[200px] place-items-center rounded-[9px] border border-dashed border-[#9fcac4] bg-white/70 text-center">
            <div>
              <div className="mb-5 flex justify-center text-[#0b7665]">
                <UploadIcon />
              </div>
              <p className="text-[18px] font-semibold text-[#1c2d30]">点击或拖拽文件到此处上传</p>
              <p className="mt-3 text-[13px] font-medium text-[#6b777a]">支持 PDF、JPG、PNG 格式，单个文件不超过 20MB</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-5">
          <LotusAvatar />
          <div className="relative rounded-[10px] bg-white px-[28px] py-[22px] shadow-[0_8px_22px_rgba(31,61,64,0.12)]">
            <span className="absolute left-[-8px] top-7 h-4 w-4 rotate-45 bg-white" />
            <p className="relative text-[18px] font-medium text-[#1d2f31]">你的主要从业方向是什么？</p>
            <p className="relative mt-5 text-[14px] font-medium text-[#8b9699]">10:16</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {chips.map((chip) => (
            <button className="h-[38px] rounded-full border border-[#c9dcda] bg-white/72 px-5 text-[14px] font-medium text-[#607174] shadow-sm" key={chip} type="button">
              {chip}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[12px] border border-[#7cbab1] bg-white px-5 py-5 shadow-[0_8px_20px_rgba(31,61,64,0.12)]">
          <p className="text-[16px] font-medium text-[#9aa3a6]">请输入你的回答...</p>
          <div className="mt-12 flex items-center justify-between text-[#102d31]">
            <div className="flex items-center gap-8">
              <AttachIcon />
              <MicIcon />
            </div>
            <button className="grid h-[54px] w-[54px] place-items-center rounded-full bg-gradient-to-br from-[#168a75] to-[#006252] text-white shadow-[0_8px_18px_rgba(0,93,80,0.25)]" type="button" aria-label="发送">
              <SendIcon />
            </button>
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-center text-[12px] font-medium text-[#8a9698]">
          <HintShieldIcon />
          小扬同学可能会出错，请核对重要信息。
        </p>
      </div>
    </section>
  );
}

function StatusBadge({ step }) {
  const toneClass = {
    done: 'bg-[#e1f2eb] text-[#006252]',
    warn: 'bg-[#fff0d8] text-[#b87100]',
    danger: 'bg-[#f9dddd] text-[#b04f54]',
  }[step.tone];

  return <span className={`rounded-[7px] px-4 py-2 text-[14px] font-semibold leading-none ${toneClass}`}>{step.status}</span>;
}

function StepRow({ step, index }) {
  const Icon = step.icon;
  const colors = ['bg-[#2fa174]', 'bg-[#7bc3ae]', 'bg-[#108367]', 'bg-[#7cc7b4]'];

  return (
    <button className="grid h-[86px] w-full grid-cols-[72px_1fr_auto_38px] items-center border-b border-[#e5eceb] px-[18px] text-left last:border-b-0" type="button">
      <span className={`grid h-[50px] w-[50px] place-items-center rounded-full text-white ${colors[index]}`}>
        <Icon />
      </span>
      <span>
        <span className="block text-[20px] font-bold leading-none text-[#1b292b]">{step.title}</span>
        <span className="mt-2 block text-[14px] font-medium text-[#6a7679]">{step.desc}</span>
      </span>
      <StatusBadge step={step} />
      <span className="text-[34px] font-light text-[#57696d]">›</span>
    </button>
  );
}

function RightApplicationCard() {
  return (
    <div className="flex h-full flex-col gap-4">
      <section className="flex-1 rounded-[14px] border border-[#dde7e5] bg-white/88 px-[30px] py-[28px] shadow-[0_16px_34px_rgba(35,70,74,0.13)] backdrop-blur-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-[30px] font-bold leading-none text-[#142528]">结构化申请卡</h2>
          <span className="rounded-[7px] border border-[#cfd9d7] bg-white px-4 py-2 text-[13px] font-medium text-[#68777a]">申请编号：APP-20250527-00123</span>
        </div>

        <div className="mt-9">
          <div className="flex items-end justify-between">
            <span className="text-[16px] font-semibold text-[#1b292b]">当前进度</span>
            <span className="text-[38px] font-bold leading-none text-[#006252]">40%</span>
          </div>
          <div className="mt-4 h-[8px] rounded-full bg-[#e1e2df]">
            <div className="h-full w-[50%] rounded-full bg-gradient-to-r from-[#279b79] to-[#006252]" />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[12px] border border-[#dbe4e2]">
          {steps.map((step, index) => (
            <StepRow index={index} key={step.title} step={step} />
          ))}
        </div>

        <p className="mt-6 flex items-center gap-2 text-[14px] font-medium text-[#667477]">
          <ClockIcon />
          可随时保存草稿，预计还需
          <span className="font-bold text-[#006252]">5 分钟</span>
        </p>

        <div className="mt-7 grid grid-cols-[164px_1fr_164px] gap-5">
          <button className="flex h-[56px] items-center justify-center gap-3 rounded-[7px] border border-[#006252] bg-white text-[18px] font-bold text-[#006252]" type="button">
            <NoteIcon />
            保存草稿
          </button>
          <button className="flex h-[56px] items-center justify-center gap-5 rounded-[7px] bg-gradient-to-br from-[#00836f] to-[#006252] text-[22px] font-bold text-white shadow-[0_10px_20px_rgba(0,93,80,0.24)]" type="button">
            继续填写
            <ArrowRightIcon />
          </button>
          <button className="flex h-[56px] items-center justify-center gap-3 rounded-[7px] border border-[#006252] bg-white text-[18px] font-bold text-[#006252]" type="button">
            <HeadsetIcon />
            转人工咨询
          </button>
        </div>
      </section>

      <section className="rounded-[14px] border border-[#c8dfdb] bg-white/78 px-[18px] py-[18px] shadow-[0_12px_26px_rgba(35,70,74,0.1)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-[#005d50]">资料来源参考 <span className="ml-1 text-[#6e7d80]">ⓘ</span></h3>
          <a className="text-[14px] font-bold text-[#005d50]" href="#">查看更多 ›</a>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-5">
          {references.map((ref) => (
            <article className="rounded-[7px] border border-[#dbe4e2] bg-white/80 px-3 py-4" key={ref.title}>
              <div className="grid grid-cols-[24px_1fr] gap-2">
                <FileIcon />
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[#27383a]">{ref.title}</p>
                  <p className="mt-3 whitespace-nowrap text-[11px] font-medium text-[#6f7d80]">
                    来源：{ref.source}
                    <span className="ml-2 rounded bg-[#dbe9ff] px-1.5 py-1 text-[11px] font-bold text-[#1b5fb8]">官方</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-[12px] font-medium text-[#7b878a]">以上内容由公开资料汇总，仅供参考，具体以主管部门要求为准。</p>
      </section>
    </div>
  );
}

export default function ApplyWorkspace() {
  return (
    <div className="mx-auto mt-5 grid max-w-[1290px] grid-cols-[606px_1fr] items-stretch gap-[28px]">
      <LeftAssistantCard />
      <RightApplicationCard />
    </div>
  );
}
