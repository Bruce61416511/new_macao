import pathlib

path = pathlib.Path(r"D:\AI workspace\workspace\macao_yang\frontend-web\src\components\MemberManagementPage.jsx")
c = path.read_text(encoding="utf-8")

# 1. Add payment_proof_url to member data via cross-reference
old_ref = "  const memberAppStatus = {};"
new_ref = """  const memberAppStatus = {};
  const memberPaymentProof = {};
  applications.forEach(a => {
    const mid = a.member_id;
    if (mid && a.payment_proof_url) memberPaymentProof[mid] = a.payment_proof_url;
    const uname = (a.username || "").replace(/_upd_\\d+$/, "");
    members.forEach(m => {
      if (!memberPaymentProof[m.id] && a.payment_proof_url && m.username === uname) {
        memberPaymentProof[m.id] = a.payment_proof_url;
      }
    });
  });"""
c = c.replace(old_ref, new_ref)

# 2. Add _paymentProof to membersWithStatus
old_map = "  const membersWithStatus = members.map(m => ({"
new_map = """  const membersWithStatus = members.map(m => ({
    ...m,
    _paymentProof: memberPaymentProof[m.id] || null,"""
c = c.replace(old_map, new_map)

# But wait, membersWithStatus already maps ...m and _appStatus. Let me check.
# Actually I need to handle this differently since the original code doesn't have membersWithStatus yet.
# Let me check what the original mapping looks like.

# Actually, the original file doesn't have membersWithStatus or memberAppStatus.
# Those were from my earlier changes that got reverted.
# Let me check.