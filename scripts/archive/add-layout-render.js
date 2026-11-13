const fs = require("fs");
const path = require("path");
const FILE = path.join(process.env.HOME, "amroha-v2/src/app/page.tsx");
let code = fs.readFileSync(FILE, "utf8");
let changes = 0;

// 1. Add layout to mapped
if (!code.includes('layout: b.layout')) {
  code = code.replace(
    /href: b\.linkUrl \|\| "",/,
    'href: b.linkUrl || "",\n    layout: b.layout || "split",'
  );
  changes++;
  console.log("✅ 1. Layout added to mapped");
} else {
  console.log("⏭  1. Already added");
}

// 2. Replace banner render block
const newBlock = `{promos.map((promo, idx) => {
                let content;

                if (promo.layout === "image-only") {
                  content = (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/7] sm:aspect-[16/5] bg-gray-100">
                      {promo.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={promo.image} alt={promo.title || "Banner"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Banner</div>
                      )}
                    </div>
                  );
                } else if (promo.layout === "overlay") {
                  content = (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/7] sm:aspect-[16/5] bg-gray-100">
                      {promo.image && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center p-4 md:p-6 text-white">
                        <p className="text-[10px] md:text-xs font-bold tracking-wide uppercase opacity-90 mb-1">{promo.brand}</p>
                        <h3 className="text-2xl md:text-4xl font-black leading-tight mb-1">{promo.title}</h3>
                        <p className="text-xs md:text-base opacity-90">{promo.subtitle}</p>
                      </div>
                    </div>
                  );
                } else {
                  content = (
                    <div className={\`\${promo.bg} rounded-2xl p-4 md:p-6 flex items-center justify-between gap-4 hover:shadow-md transition\`}>
                      <div className="flex-1 min-w-0">
                        <p className={\`text-[10px] md:text-xs font-bold \${promo.brandColor} mb-1 tracking-wide uppercase\`}>{promo.brand}</p>
                        <h3 className={\`text-2xl md:text-4xl font-black \${promo.text} leading-tight mb-1\`}>{promo.title}</h3>
                        <p className={\`text-xs md:text-base \${promo.text} opacity-80\`}>{promo.subtitle}</p>
                      </div>
                      <div className="shrink-0 w-28 h-28 md:w-44 md:h-44 relative">
                        {promo.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={promo.image} alt={promo.title} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-white/50 rounded flex items-center justify-center text-gray-400 text-xs">Image</div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={idx} className="shrink-0 w-full">
                    {promo.href ? (
                      <Link href={promo.href} target={promo.href.startsWith("http") ? "_blank" : undefined} rel={promo.href.startsWith("http") ? "noopener noreferrer" : undefined} className="block">
                        {content}
                      </Link>
                    ) : (content)}
                  </div>
                );
              })}`;

const oldRegex = /\{promos\.map\(\(promo, idx\) => \([\s\S]*?<\/Link>\s*<\/div>\s*\)\)\}/;
if (oldRegex.test(code)) {
  code = code.replace(oldRegex, newBlock);
  changes++;
  console.log("✅ 2. Banner block replaced");
} else if (code.includes('promo.layout === "image-only"')) {
  console.log("⏭  2. Already replaced");
} else {
  console.log("❌ 2. Could not find banner block");
}

fs.writeFileSync(FILE, code, "utf8");
console.log("\n=== Changes: " + changes + " ===");
