const fs = require("fs");
const path = require("path");
const FILE = path.join(process.env.HOME, "amroha-v2/src/app/kggg0b/banners/page.tsx");
let code = fs.readFileSync(FILE, "utf8");
let changes = 0;

// 1. Add layout to Banner type
if (!code.includes("layout: string;")) {
  code = code.replace(
    /(theme: string;\n)/,
    '$1  layout: string;\n'
  );
  changes++;
  console.log("✅ 1. layout added to Banner type");
} else {
  console.log("⏭  1. layout already in Banner type");
}

// 2. EMPTY_FORM check
if (!code.includes('layout: "split",') || code.match(/EMPTY_FORM[\s\S]*?layout:/) === null) {
  if (!/EMPTY_FORM[\s\S]{0,300}layout:/.test(code)) {
    code = code.replace(
      /(const EMPTY_FORM = \{[\s\S]*?theme: "teal",\n)/,
      '$1  layout: "split",\n'
    );
    changes++;
    console.log("✅ 2. layout added to EMPTY_FORM");
  } else {
    console.log("⏭  2. EMPTY_FORM already has layout");
  }
} else {
  console.log("⏭  2. EMPTY_FORM already has layout");
}

fs.writeFileSync(FILE, code, "utf8");
console.log("\n=== Changes: " + changes + " ===");
