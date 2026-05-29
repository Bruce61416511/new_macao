import pathlib

path = pathlib.Path(r"D:\AI workspace\workspace\macao_yang\frontend-web\src\components\MemberManagementPage.jsx")
c = path.read_text(encoding="utf-8")

# === 1. Remove members API, keep only applications ===
c = c.replace(
    'const MEMBERS_API = "/v1/admin/members";\nconst APPS_API = "/v1/admin/members/applications";',
    'const APPS_API = "/v1/admin/members/applications";'
)

# === 2. Clean state - remove members related state ===
c = c.replace(
    'const [members, setMembers] = useState([]);\n  const [applications, setApplications] = useState([]);',
    'const [applications, setApplications] = useState([]);'
)

# === 3. Simplify fetchData ===
old_fetch = """  async function fetchData(p = page) {
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
        setApplications(data.items || []);
      }
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }"""

new_fetch = """  async function fetchData() {
    setLoading(true);
    try {
      const aRes = await fetch(APPS_API, { headers: authHeaders });
      if (aRes.ok) {
        const data = await aRes.json();
        setApplications(data.items || []);
      }
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }"""

c = c.replace(old_fetch, new_fetch)

# === 4. Update the edit modal to use application data (remove member references) ===
# Edit now uses applications not members
c = c.replace('const [editTarget, setEditTarget] = useState(null);', 'const [editTarget, setEditTarget] = useState(null);')
# Keep edit functionality but it opens from AppTable now

# === 5. Replace filters: group by status ===
old_filters = """  const activeMembers = members.filter(m => m.is_active);
  const inactiveMembers = members.filter(m => !m.is_active);

  const pendingApps = applications.filter(a => a.status === "\u521d\u5be9\u901a\u8fc7" || a.status === "\u7d42\u5be9\u901a\u8fc7");
  const initialRejectedApps = applications.filter(a => a.status === "\u521d\u5be9\u4e0d\u901a\u8fc7");
  const finalRejectedApps = applications.filter(a => a.status === "\u7d42\u5be9\u4e0d\u901a\u8fc7");"""

new_filters = """  const pendingApps = applications.filter(a => a.status === "\u521d\u5be9\u901a\u8fc7" || a.status === "\u7d42\u5be9\u901a\u8fc7");
  const initialRejectedApps = applications.filter(a => a.status === "\u521d\u5be9\u4e0d\u901a\u8fc7");
  const finalRejectedApps = applications.filter(a => a.status === "\u7d42\u5be9\u4e0d\u901a\u8fc7");
  const paymentPendingApps = applications.filter(a => a.status === "\u5f85\u7f34\u8d39");
  const paidApps = applications.filter(a => a.status === "\u5df2\u7f34\u8d39");
  const joinedApps = applications.filter(a => a.status === "\u5df2\u5165\u4f1a");"""

c = c.replace(old_filters, new_filters)

# === 6. Remove MemberTable and openEdit/delete related to members ===
# Actually, let me keep openEdit as-is but it now works on applications.
# Remove the member table sections, replace with status-grouped app sections

old_sections = """            {activeMembers.length > 0 && (
              <Section title={"\u5728\u7c4d\u4f1a\u5458"} badge="text-[#006252] bg-[#e7f5f0]" count={activeMembers.length}>
                <MemberTable members={activeMembers} />
              </Section>
            )}
            {inactiveMembers.length > 0 && (
              <Section title={"\u505c\u7528\u4f1a\u5458"} badge="text-[#c53030] bg-[#fef0f0]" count={inactiveMembers.length}>
                <MemberTable members={inactiveMembers} />
              </Section>
            )}
            {pendingApps.length > 0 && (
              <Section title={"\u5f85\u5904\u7406\u7533\u8bf7"} badge="text-[#b7950b] bg-[#fef9e7]" count={pendingApps.length}>
                <AppTable apps={pendingApps} />
              </Section>
            )}
            {initialRejectedApps.length > 0 && (
              <Section title={"\u521d\u5be9\u4e0d\u901a\u8fc7"} badge="text-[#e67e22] bg-[#fef5ec]" count={initialRejectedApps.length}>
                <AppTable apps={initialRejectedApps} />
              </Section>
            )}
            {finalRejectedApps.length > 0 && (
              <Section title={"\u7d42\u5be9\u4e0d\u901a\u8fc7"} badge="text-[#c53030] bg-[#fef0f0]" count={finalRejectedApps.length}>
                <AppTable apps={finalRejectedApps} />
              </Section>
            )}"""

new_sections = """            {joinedApps.length > 0 && (
              <Section title={"\u5df2\u5165\u4f1a"} badge="text-[#006252] bg-[#e7f5f0]" count={joinedApps.length}>
                <AppTable apps={joinedApps} />
              </Section>
            )}
            {paidApps.length > 0 && (
              <Section title={"\u5df2\u7f34\u8d39"} badge="text-[#006252] bg-[#e7f5f0]" count={paidApps.length}>
                <AppTable apps={paidApps} />
              </Section>
            )}
            {paymentPendingApps.length > 0 && (
              <Section title={"\u5f85\u7f34\u8d39"} badge="text-[#b7950b] bg-[#fef9e7]" count={paymentPendingApps.length}>
                <AppTable apps={paymentPendingApps} />
              </Section>
            )}
            {pendingApps.length > 0 && (
              <Section title={"\u5f85\u5904\u7406\u7533\u8bf7"} badge="text-[#b7950b] bg-[#fef9e7]" count={pendingApps.length}>
                <AppTable apps={pendingApps} />
              </Section>
            )}
            {initialRejectedApps.length > 0 && (
              <Section title={"\u521d\u5be9\u4e0d\u901a\u8fc7"} badge="text-[#e67e22] bg-[#fef5ec]" count={initialRejectedApps.length}>
                <AppTable apps={initialRejectedApps} />
              </Section>
            )}
            {finalRejectedApps.length > 0 && (
              <Section title={"\u7d42\u5be9\u4e0d\u901a\u8fc7"} badge="text-[#c53030] bg-[#fef0f0]" count={finalRejectedApps.length}>
                <AppTable apps={finalRejectedApps} />
              </Section>
            )}"""

c = c.replace(old_sections, new_sections)

# === 7. Update empty check ===
c = c.replace('members.length === 0 && applications.length === 0', 'applications.length === 0')

# === 8. Add payment column to AppTable ===
c = c.replace(
    '<th className="px-4 py-3">\u8d44\u8d28\u6587\u4ef6</th>\n              <th className="px-4 py-3">\u72b6\u6001</th>\n              <th className="px-4 py-3">\u63d0\u4ea4\u65f6\u95f4</th>',
    '<th className="px-4 py-3">\u8d44\u8d28\u6587\u4ef6</th>\n              <th className="px-4 py-3">\u7f34\u8d39\u51ed\u8bc1</th>\n              <th className="px-4 py-3">\u72b6\u6001</th>\n              <th className="px-4 py-3">\u63d0\u4ea4\u65f6\u95f4</th>'
)

c = c.replace(
    'parseFiles(a.qualification_files); return files.length > 0 ? files.map((f, i) => React.createElement("a", { key: i, href: BACKEND + f, target: "_blank", className: "text-[#006252] hover:underline mr-2" }, "\u9644\u4ef6" + (i+1))) : "-"; })()}</td>\n                <td className="px-4 py-3">\n                  <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${statusBadge(a.status)}`}>{a.status}</span>',
    'parseFiles(a.qualification_files); return files.length > 0 ? files.map((f, i) => React.createElement("a", { key: i, href: BACKEND + f, target: "_blank", className: "text-[#006252] hover:underline mr-2" }, "\u9644\u4ef6" + (i+1))) : "-"; })()}</td>\n                <td className="px-4 py-3 text-[12px]">{a.payment_proof_url ? <a href={BACKEND + a.payment_proof_url} target="_blank" rel="noreferrer" className="text-[#006252] underline">\u67e5\u770b</a> : "-"}</td>\n                <td className="px-4 py-3">\n                  <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${statusBadge(a.status)}`}>{a.status}</span>'
)

# === 9. Remove MemberTable entirely ===
idx = c.find('function MemberTable')
end = c.find('function AppTable', idx)
if idx > 0 and end > 0:
    c = c[:idx] + c[end:]

# === 10. Clean up unused state ===
c = c.replace('const [page, setPage] = useState(1);\n  const [total, setTotal] = useState(0);\n  const pageSize = 50;', '')

path.write_text(c, encoding="utf-8")
print("Done")