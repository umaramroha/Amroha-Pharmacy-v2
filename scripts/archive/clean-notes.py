import re

# === Contact page ===
with open("src/app/contact/page.tsx", "r") as f:
    content = f.read()

# Remove the green "Quick Response" box
content = re.sub(
    r'\s*<div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">\s*'
    r'<p className="text-xs text-green-800">\s*'
    r'💡 <strong>Quick Response:</strong>.*?</p>\s*</div>',
    "",
    content,
    flags=re.DOTALL,
)

# Remove "Message WhatsApp pe khulega" line
content = re.sub(
    r'\s*<p className="text-xs text-gray-500 text-center">\s*'
    r'Message WhatsApp pe khulega, wahin se bhej dena\s*</p>',
    "",
    content,
    flags=re.DOTALL,
)

with open("src/app/contact/page.tsx", "w") as f:
    f.write(content)

print("✅ Contact page cleaned")

# === Blog page ===
with open("src/app/blogs/page.tsx", "r") as f:
    content = f.read()

# Remove "Coming Soon" box
content = re.sub(
    r'\s*<div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">\s*'
    r'<p className="text-sm text-yellow-800">\s*'
    r'<strong>Coming Soon:</strong>.*?</p>\s*</div>',
    "",
    content,
    flags=re.DOTALL,
)

with open("src/app/blogs/page.tsx", "w") as f:
    f.write(content)

print("✅ Blog page cleaned")

print("\n🎉 All developer notes removed!")
