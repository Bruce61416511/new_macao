
import os, re

filepath = r"D:\AI workspace\workspace\macao_yang\frontend-web\src\components\HeroSection.jsx"
with open(filepath, "rb") as f:
    content = f.read()

bom = content[:3] if content[:3] == b"\xef\xbb\xbf" else b""
if bom:
    content = content[3:]

# 1. Add useState import at top
content = b'import { useState } from "react";\r\n' + content

# 2. Add state to HeroSection
content = content.replace(
    b"export default function HeroSection() {\r\n  return (",
    b"export default function HeroSection() {\r\n  const [showBenefits, setShowBenefits] = useState(false);\r\n  return ("
)

# 3. Modify quickActions.map to handle ???? click
content = content.replace(
    b"quickActions.map((action) => (\r\n                <ActionButton action={action} key={action.label} />",
    b"quickActions.map((action) => (\r\n                action.label === '\xe4\xbc\x9a\xe5\x91\x98\xe6\x9d\x83\xe7\x9b\x8a' ? (\r\n                  <ActionButton action={{...action, onClick: () => setShowBenefits(true)}} key={action.label} />\r\n                ) : (\r\n                  <ActionButton action={action} key={action.label} />\r\n                )"
)

# Need to close the ternary
content = content.replace(
    b"              ))}\r\n            </div>",
    b"              )))}\r\n            </div>"
)

# 4. Add modal before closing </section> of HeroSection
# Find the last </section> before export
last_section = content.rfind(b"</section>")
if last_section > 0:
    modal = b'\r\n      {showBenefits && <PublicBenefitsModal onClose={() => setShowBenefits(false)} />}'
    content = content[:last_section + len(b"</section>")] + modal + content[last_section + len(b"</section>"):]

# 5. Add PublicBenefitsModal component definition at end
# Read it from the existing file
with open(r"D:\AI workspace\workspace\macao_yang\frontend-web\src\components\PublicBenefitsModal.jsx", "rb") as f:
    pub = f.read()

# Strip BOM and imports from PublicBenefitsModal
if pub[:3] == b"\xef\xbb\xbf":
    pub = pub[3:]

# Remove the React import from PublicBenefitsModal
pub = pub.replace(b'import React from "react";\r\n', b'')

# Add PublicBenefitsModal before HeroSection export
content = content.replace(
    b"export default function HeroSection() {",
    pub + b"\r\nexport default function HeroSection() {"
)

# Fix ActionButton to support onClick
content = content.replace(
    b"function ActionButton({ action }) {",
    b"function ActionButton({ action, onClick }) {"
)

content = content.replace(
    b"const Element = isPrimary || action.href ? 'a' : 'button';",
    b"const Element = isPrimary || action.href ? 'a' : 'button';\r\n  const handleClick = onClick || action.onClick;"
)

# Add onClick to the Element - find the opening tag
# Simple approach: add onClick after className
content = content.replace(
    b"      className={[",
    b"      onClick={handleClick}\r\n      className={["
)

with open(filepath, "wb") as f:
    f.write(bom + content)
print("HeroSection patched")
