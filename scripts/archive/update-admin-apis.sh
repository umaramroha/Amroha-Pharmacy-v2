#!/bin/bash
cd ~/aq-website

echo "🔄 Updating admin APIs..."

FILES=(
  "src/app/api/admin/login/route.ts"
  "src/app/api/admin/logout/route.ts"
  "src/app/api/admin/me/route.ts"
  "src/app/api/admin/orders/route.ts"
  "src/app/api/admin/orders/[id]/route.ts"
  "src/app/api/admin/products/route.ts"
  "src/app/api/admin/products/[id]/route.ts"
  "src/app/api/admin/stats/route.ts"
  "src/app/api/admin/settings/route.ts"
)

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    sed -i 's|import { sessionOptions, SessionData } from "@/lib/session";|import { adminSessionOptions, AdminSessionData } from "@/lib/adminSession";|g' "$f"
    sed -i 's|import { sessionOptions } from "@/lib/session";|import { adminSessionOptions } from "@/lib/adminSession";|g' "$f"
    sed -i 's|sessionOptions|adminSessionOptions|g' "$f"
    sed -i 's|<SessionData>|<AdminSessionData>|g' "$f"
    sed -i 's|session.userId|session.adminId|g' "$f"
    echo "  ✓ $f"
  fi
done

echo ""
echo "✅ Done! All admin APIs updated"
echo ""
echo "Check karo:"
grep -l "adminSessionOptions" src/app/api/admin/*/route.ts src/app/api/admin/*/*/route.ts
