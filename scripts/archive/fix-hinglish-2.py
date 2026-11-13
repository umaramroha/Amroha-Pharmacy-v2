# ============================================
# COMPREHENSIVE HINGLISH FIX
# (Blog content ko chhod kar, sirf UI messages)
# ============================================

def fix_file(path, replacements):
    try:
        with open(path, "r") as f:
            content = f.read()
        original = content
        for old, new in replacements:
            content = content.replace(old, new)
        if content != original:
            with open(path, "w") as f:
                f.write(content)
            print(f"✓ {path}")
        else:
            print(f"  (no change) {path}")
    except FileNotFoundError:
        print(f"✗ Not found: {path}")
    except Exception as e:
        print(f"✗ Error in {path}: {e}")


# ============ 1. email/templates.ts ============
fix_file("src/lib/email/templates.ts", [
    ("Koi sawaal? WhatsApp karein:", "Any questions? WhatsApp us:"),
])


# ============ 2. contact/page.tsx ============
fix_file("src/app/contact/page.tsx", [
    ("through humse sampark karein.", "reach out to us."),
    ("direct message karein.", "message us directly."),
])


# ============ 3. wishlist/page.tsx ============
fix_file("src/app/wishlist/page.tsx", [
    ("Products save karein aur baad me dekhein.",
     "Save products and view them later."),
])


# ============ 4. about/page.tsx ============
fix_file("src/app/about/page.tsx", [
    ("karein ya call karein — hum aapki health journey me saath hain.",
     "or call us — we are here to support your health journey."),
])


# ============ 5. page.tsx (Homepage) ============
fix_file("src/app/page.tsx", [
    ("Ayurvedic tips aur exclusive offers paane ke liye subscribe karein",
     "Subscribe to receive Ayurvedic tips and exclusive offers"),
])


# ============ 6. blogs/[slug]/page.tsx ============
fix_file("src/app/blogs/[slug]/page.tsx", [
    ("baat karein.", "talk to us."),
])


# ============ 7. api/orders/route.ts ============
fix_file("src/app/api/orders/route.ts", [
    ("error: `Ek order me maximum ${MAX_TOTAL_ITEMS} items ho sakte hain. Bulk order ke liye WhatsApp pe contact karein.`,",
     "error: `Maximum ${MAX_TOTAL_ITEMS} items allowed per order. For bulk orders, please contact us on WhatsApp.`,"),
])


# ============ 8. api/orders/[id]/cancel/route.ts ============
fix_file("src/app/api/orders/[id]/cancel/route.ts", [
    ('error: `Order "${order.status}" status me hai, isliye ab cancel nahi ho sakta. Shipped orders cancel nahi hote — kripya humse WhatsApp pe contact karein.`',
     'error: `Order is currently "${order.status}" and cannot be cancelled. Shipped orders cannot be cancelled — please contact us on WhatsApp.`'),
    ('? "Aapka payment refund 5-7 working days me process ho jayega. Koi question ho toh WhatsApp pe contact karein."',
     '? "Your payment will be refunded within 5-7 business days. For any questions, please contact us on WhatsApp."'),
    ("Koi sawaal? WhatsApp karein:", "Any questions? WhatsApp us:"),
    ('<p>Admin panel me check karein: <a href="https://amrohapharmastore.vercel.app/admin/orders">View Order</a></p>',
     '<p>Review in admin panel: <a href="https://amrohapharmacy.vercel.app/kggg0b/orders">View Order</a></p>'),
])


# ============ 9. checkout/page.tsx ============
fix_file("src/app/checkout/page.tsx", [
    ("Ye raha mera payment screenshot. Order confirm karein please.",
     "Please find my payment screenshot attached. Kindly confirm my order."),
    ("Scan karke pay karein ₹{finalTotal}",
     "Scan to pay ₹{finalTotal}"),
    ("GPay, PhonePe, Paytm, ya kisi bhi UPI app se scan karein",
     "Scan using GPay, PhonePe, Paytm, or any UPI app"),
    ("Neeche button pe click karein — payment app khul jayega",
     "Click the button below to open your payment app"),
])


# ============ 10. kggg0b/products/page.tsx ============
fix_file("src/app/kggg0b/products/page.tsx", [
    ('`Delete "${name}"? Ye action undo nahi hoga.`',
     '`Delete "${name}"? This action cannot be undone.`'),
])


# ============ 11. orders/[id]/page.tsx ============
fix_file("src/app/orders/[id]/page.tsx", [
    ('"Kya aap ye order cancel karna chahte hain?\\n\\nYe action undo nahi hoga. Stock wapas add ho jayega aur agar payment ho chuki hai toh refund 5-7 working days me process hoga."',
     '"Do you want to cancel this order?\\n\\nThis action cannot be undone. Stock will be restored and if payment has been made, the refund will be processed within 5-7 business days."'),
    ('? "Refund 5-7 working days me process hoga. Confirmation email bhej di gayi hai."',
     '? "Refund will be processed within 5-7 business days. A confirmation email has been sent."'),
    ("sakte hain. Shipped hone ke baad cancel nahi hoga.",
     "This order can be cancelled as it is still in \"${order.status}\" status. Once shipped, orders cannot be cancelled."),
])


print("\n🎉 Hinglish fix complete!")
print("⚠️ Note: Blog content (src/data/blogs.ts) intentionally Hinglish rakha gaya hai.")
