import re

# ============================================
# File 1: src/lib/email/templates.ts
# ============================================
with open("src/lib/email/templates.ts", "r") as f:
    content = f.read()
content = content.replace(
    "Aapka order successfully place ho gaya hai. Hum jald hi aapke order ko dispatch karenge aur tracking details WhatsApp pe bhej denge.",
    "Your order has been placed successfully. We will dispatch it shortly and send tracking details on WhatsApp."
)
with open("src/lib/email/templates.ts", "w") as f:
    f.write(content)
print("✓ email/templates.ts")

# ============================================
# File 2: src/app/error.tsx
# ============================================
with open("src/app/error.tsx", "r") as f:
    content = f.read()
content = content.replace("Kuch galat ho gaya", "Something went wrong")
content = content.replace("Page load karne me problem aayi. Thoda wait karke dobara try karo.", "There was a problem loading the page. Please wait a moment and try again.")
with open("src/app/error.tsx", "w") as f:
    f.write(content)
print("✓ error.tsx")

# ============================================
# File 3: src/app/concerns/page.tsx
# ============================================
with open("src/app/concerns/page.tsx", "r") as f:
    content = f.read()
content = content.replace(
    "Har samasya ka natural samadhan. Ayurvedic aur Unani experts dwara approved concerns ke hisaab se products dhundhein.",
    "Natural solutions for every health concern. Browse products by Ayurvedic and Unani expert-approved concerns."
)
content = content.replace(
    "Har samasya ka natural samadhan — Ayurvedic aur Unani experts dwara",
    "Natural solutions for every health concern — approved by Ayurvedic and Unani experts"
)
with open("src/app/concerns/page.tsx", "w") as f:
    f.write(content)
print("✓ concerns/page.tsx")

# ============================================
# File 4: src/app/blogs/[slug]/page.tsx
# ============================================
with open("src/app/blogs/[slug]/page.tsx", "r") as f:
    content = f.read()
content = content.replace(
    "Ye blog exist nahi karta ya remove ho gaya hai.",
    "This blog does not exist or has been removed."
)
with open("src/app/blogs/[slug]/page.tsx", "w") as f:
    f.write(content)
print("✓ blogs/[slug]/page.tsx")

# ============================================
# File 5: src/app/api/orders/route.ts
# ============================================
with open("src/app/api/orders/route.ts", "r") as f:
    content = f.read()
content = content.replace(
    '"Aapne aaj ke liye order limit reach kar li hai. Kripya kal try karein ya humse WhatsApp pe contact karein."',
    '"You have reached your daily order limit. Please try again tomorrow or contact us on WhatsApp."'
)
content = content.replace(
    "error: `Ek product ka maximum ${MAX_QTY_PER_PRODUCT} units order kar sakte hain. Kripya quantity kam karein.`,",
    "error: `Maximum ${MAX_QTY_PER_PRODUCT} units allowed per product. Please reduce the quantity.`,"
)
content = content.replace(
    'error: `Sirf ${product.stock} units available hain "${product.name}" ke liye. Kripya quantity kam karein.`,',
    'error: `Only ${product.stock} units available for "${product.name}". Please reduce the quantity.`,'
)
content = content.replace(
    '"STOCK_CHANGED: Stock abhi available nahi hai. Kripya cart refresh karein."',
    '"STOCK_CHANGED: Stock is no longer available. Please refresh your cart."'
)
content = content.replace(
    '"Stock abhi available nahi hai. Kripya cart refresh karein aur dobara try karein.",',
    '"Stock is no longer available. Please refresh your cart and try again.",'
)
with open("src/app/api/orders/route.ts", "w") as f:
    f.write(content)
print("✓ api/orders/route.ts")

# ============================================
# File 6: src/app/api/orders/[id]/cancel/route.ts
# ============================================
with open("src/app/api/orders/[id]/cancel/route.ts", "r") as f:
    content = f.read()
content = content.replace(
    'message: "Order successfully cancel ho gaya. Refund 5-7 working days me process hoga.",',
    'message: "Order cancelled successfully. Refund will be processed within 5-7 business days.",'
)
content = content.replace(
    '{ error: "Order cancel nahi ho paya. Kripya baad me try karein." },',
    '{ error: "Failed to cancel the order. Please try again later." },'
)
with open("src/app/api/orders/[id]/cancel/route.ts", "w") as f:
    f.write(content)
print("✓ api/orders/[id]/cancel/route.ts")

# ============================================
# File 7: src/app/orders/[id]/page.tsx
# ============================================
with open("src/app/orders/[id]/page.tsx", "r") as f:
    content = f.read()
content = content.replace(
    'setCancelError("Network error. Kripya dobara try karein.");',
    'setCancelError("Network error. Please try again.");'
)
content = content.replace(
    "✅ Order successfully cancel ho gaya!",
    "✅ Order cancelled successfully!"
)
with open("src/app/orders/[id]/page.tsx", "w") as f:
    f.write(content)
print("✓ orders/[id]/page.tsx")

print("\n🎉 All Hinglish converted to English!")
