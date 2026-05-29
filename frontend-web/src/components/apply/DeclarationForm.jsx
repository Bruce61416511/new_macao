export default function DeclarationForm({ data, onChange, errors }) {
  const agreed = data.declaration_agreed === true;
  const set = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      <div className="rounded-[9px] border border-[#d4e8e3] bg-[#f8fbfb] px-6 py-5">
        <h4 className="text-[16px] font-bold text-[#142528]">申请人声明与授权</h4>
        <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-[#57696d]">
          <p>1. 本人声明以上所填信息均真实、准确、完整，如有虚假，愿承担由此产生的一切后果。</p>
          <p>2. 本人同意并授权澳门直播协会对本人提交的信息进行核实、存档及在必要范围内使用。</p>
          <p>3. 本人已知悉会员章程及相关规定，并承诺遵守协会的各项制度。</p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => set("declaration_agreed", e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded-[4px] border-[#cfd9d7] text-[#006252] focus:ring-[#006252]/30 accent-[#006252]"
        />
        <span className={`text-[14px] font-medium ${errors?.declaration_agreed ? "text-red-500" : "text-[#27383a]"}`}>
          我已阅读并同意以上声明与授权内容
          {errors?.declaration_agreed && (
            <span className="block mt-1 text-[12px] text-red-500">{errors.declaration_agreed}</span>
          )}
        </span>
      </label>
    </div>
  );
}
