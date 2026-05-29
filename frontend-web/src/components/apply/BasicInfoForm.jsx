import { useEffect, useRef, useState } from "react";
import { checkDuplicate } from "../../services/api.js";

const TIER_OPTIONS = [
  { value: "普通会员", label: "普通会员", desc: "适合个人从业者，年费 500 澳门元" },
  { value: "高级会员", label: "高级会员", desc: "适合机构/企业，年费 1000 澳门元" },
];

function fieldClass(hasError) {
  return [
    "w-full rounded-[7px] border bg-white/90 px-4 py-3 text-[15px] font-medium text-[#1b292b]",
    "placeholder:text-[#a0acaf] focus:outline-none focus:ring-2 focus:ring-[#006252]/30",
    "transition-colors",
    hasError ? "border-red-400" : "border-[#cfd9d7]",
  ].join(" ");
}

function Label({ children, required }) {
  return (
    <label className="mb-1.5 block text-[14px] font-semibold text-[#27383a]">
      {children}
      {required ? <span className="ml-1 text-red-400">*</span> : null}
    </label>
  );
}

function ErrorText({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-[12px] font-medium text-red-500">{children}</p>;
}

function ConflictWarning({ children }) {
  if (!children) return null;
  return <p className="mb-1.5 text-[12px] font-medium text-red-500">{children}</p>;
}

export default function BasicInfoForm({ data, onChange, errors }) {
  const set = (field, value) => onChange({ ...data, [field]: value });
  const [conflicts, setConflicts] = useState({});
  const debounceRef = useRef(null);

  useEffect(() => {
    const username = data.username || "";
    const idNumber = data.id_number || "";

    if (username.length < 2 && idNumber.length < 15) {
      setConflicts({});
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const u = username.length >= 2 ? username : null;
        const id = idNumber.length >= 15 ? idNumber : null;
        if (!u && !id) {
          setConflicts({});
          return;
        }
        const result = await checkDuplicate(u, id);
        const next = {};
        if (result.username_exists) next.username = "该用户名已被占用，请更换";
        if (result.id_number_exists) next.id_number = "该证件号码已被注册，请检查";
        setConflicts(next);
      } catch {
        // Silently ignore network errors
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data.username, data.id_number]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label required>用户名</Label>
          <ConflictWarning>{conflicts.username}</ConflictWarning>
          <input
            className={fieldClass(errors?.username || conflicts.username)}
            placeholder="字母或数字，2-50 位"
            autoComplete="off"
            value={data.username || ""}
            onChange={(e) => set("username", e.target.value)}
          />
          <ErrorText>{errors?.username}</ErrorText>
        </div>
        <div>
          <Label required>密码</Label>
          <input
            className={fieldClass(errors?.password)}
            type="password"
            placeholder="设置登录密码"
            autoComplete="new-password"
            value={data.password || ""}
            onChange={(e) => set("password", e.target.value)}
          />
          <ErrorText>{errors?.password}</ErrorText>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label required>申请人姓名</Label>
          <input
            className={fieldClass(errors?.applicant_name)}
            placeholder="真实姓名"
            autoComplete="off"
            value={data.applicant_name || ""}
            onChange={(e) => set("applicant_name", e.target.value)}
          />
          <ErrorText>{errors?.applicant_name}</ErrorText>
        </div>
        <div>
          <Label required>证件号码</Label>
          <ConflictWarning>{conflicts.id_number}</ConflictWarning>
          <input
            className={fieldClass(errors?.id_number || conflicts.id_number)}
            placeholder="身份证 / 护照号码，15-18 位"
            autoComplete="off"
            value={data.id_number || ""}
            onChange={(e) => set("id_number", e.target.value)}
          />
          <ErrorText>{errors?.id_number}</ErrorText>
        </div>
      </div>

      <div>
        <Label required>联系电话</Label>
        <input
          className={fieldClass(errors?.applicant_phone)}
          placeholder="可联系到本人的手机号码"
          autoComplete="off"
          value={data.applicant_phone || ""}
          onChange={(e) => set("applicant_phone", e.target.value)}
        />
        <ErrorText>{errors?.applicant_phone}</ErrorText>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>电子邮箱</Label>
          <input
            className={fieldClass(errors?.applicant_email)}
            placeholder="选填"
            autoComplete="off"
            value={data.applicant_email || ""}
            onChange={(e) => set("applicant_email", e.target.value)}
          />
          <ErrorText>{errors?.applicant_email}</ErrorText>
        </div>
        <div>
          <Label>申请会员级别</Label>
          <select
            className={fieldClass(false)}
            value={data.requested_tier || ""}
            onChange={(e) => set("requested_tier", e.target.value)}
          >
            <option value="">请选择</option>
            {TIER_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label>通讯地址</Label>
        <input
          className={fieldClass(false)}
          placeholder="选填"
          autoComplete="off"
          value={data.applicant_address || ""}
          onChange={(e) => set("applicant_address", e.target.value)}
        />
      </div>

      {data.requested_tier && (
        <div className="rounded-[9px] border border-[#d4e8e3] bg-[#f0faf4] px-5 py-4">
          <p className="text-[14px] font-semibold text-[#005d50]">
            {TIER_OPTIONS.find((t) => t.value === data.requested_tier)?.label}
          </p>
          <p className="mt-1 text-[13px] font-medium text-[#57696d]">
            {TIER_OPTIONS.find((t) => t.value === data.requested_tier)?.desc}
          </p>
        </div>
      )}
    </div>
  );
}