import re
import glob

files = glob.glob("src/app/policies/*/page.tsx")

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace date placeholders
    content = content.replace("[DD/MM/YYYY]", "26/09/2026")
    
    # Replace any remaining placeholders
    content = content.replace("[LEGAL NAME]", "Umar Imam")
    content = content.replace(
        "[FULL ADDRESS, AMROHA, UTTAR PRADESH, INDIA]",
        "Mohalla Nal, Amroha, Uttar Pradesh, India"
    )
    content = content.replace("[GSTIN, IF APPLICABLE]", "Not Applicable")
    content = content.replace(
        "[OFFICIAL EMAIL]", "Amrohapharmastore@gmail.com"
    )
    content = content.replace(
        "[PHONE/WHATSAPP NUMBER]", "+91 80779 88509"
    )
    content = content.replace("[PHONE NUMBER]", "+91 80779 88509")
    content = content.replace(
        "[EMAIL ADDRESS]", "Amrohapharmastore@gmail.com"
    )
    content = content.replace("[NAME]", "Umar Imam")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"  ✓ {filepath}")

print("\n✅ All placeholders filled")
