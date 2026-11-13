const fs = require("fs");
const path = require("path");

const FILE = path.join(
  process.env.HOME,
  "amroha-v2/src/app/products/[slug]/page.tsx"
);

let code = fs.readFileSync(FILE, "utf8");
let changes = 0;

// 1. Add images: string[] to type Product
if (!code.includes("images: string[];")) {
  code = code.replace(
    /(image: string \| null;\n)/,
    "$1  images: string[];\n"
  );
  changes++;
  console.log("✅ 1. images: string[] added");
} else {
  console.log("⏭  1. images already exists");
}

// 2. Add activeImage state
if (!code.includes("activeImage")) {
  code = code.replace(
    /(const \[activeTab, setActiveTab\] =\n\s+useState<Tab>\("description"\);\n)/,
    "$1\n  const [activeImage, setActiveImage] = useState(0);\n"
  );
  changes++;
  console.log("✅ 2. activeImage state added");
} else {
  console.log("⏭  2. activeImage already exists");
}

// 3. setActiveImage(0) after setProduct
if (!code.includes("setActiveImage(0)")) {
  code = code.replace(
    /(setProduct\(fetchedProduct\);\n)/,
    "$1        setActiveImage(0);\n"
  );
  changes++;
  console.log("✅ 3. setActiveImage(0) added");
} else {
  console.log("⏭  3. setActiveImage(0) already exists");
}

// 4. gallery array after categoryLabel block
if (!code.includes("const gallery: string[]")) {
  code = code.replace(
    /(const categoryLabel = product\.category\n\s+\? categoryLabels\[product\.category\] \|\|\n\s+product\.category\n\s+: null;\n)/,
    "$1\n  const gallery: string[] =\n    product.images && product.images.length > 0\n      ? product.images\n      : product.image\n      ? [product.image]\n      : [];\n"
  );
  changes++;
  console.log("✅ 4. gallery array added");
} else {
  console.log("⏭  4. gallery already exists");
}

// 5. Replace image section
const oldImgRegex = /\{\/\* IMAGE -+\s*\*\/\}[\s\S]*?(?=\{\/\* DETAILS)/;
const newImgSection = `{/* IMAGE GALLERY ------------------------------------------------ */}

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {discount > 0 && (
                <div className="absolute left-4 top-4 z-10 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold">
                  {discount}% OFF
                </div>
              )}

              {/* MAIN IMAGE */}
              <div className="aspect-square bg-white">
                {gallery.length > 0 && gallery[activeImage] ? (
                  <img
                    src={gallery[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                    <PackageIcon className="w-20 h-20" />
                    <p className="mt-3 text-sm text-gray-400">
                      Product image unavailable
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* THUMBNAILS */}
            {gallery.length > 1 && (
              <div className="flex gap-2 sm:gap-3 mt-3 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={\`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition \${
                      activeImage === idx
                        ? "border-primary"
                        : "border-gray-200 hover:border-gray-400"
                    }\`}
                    aria-label={\`View image \${idx + 1}\`}
                  >
                    <img
                      src={img}
                      alt={\`\${product.name} \${idx + 1}\`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* IMAGE NOTE */}
            <div className="hidden sm:flex items-center justify-center gap-2 text-xs text-gray-400 mt-3">
              <ShieldIcon />
              Product image shown for representation. Refer to packaging for exact details.
            </div>
          </div>

          `;

if (oldImgRegex.test(code)) {
  code = code.replace(oldImgRegex, newImgSection);
  changes++;
  console.log("✅ 5. Image section replaced with gallery");
} else {
  console.log("⚠️  5. Image section NOT matched — manual check needed");
}

fs.writeFileSync(FILE, code, "utf8");
console.log("\n=== Total changes: " + changes + " ===");
console.log("File saved: " + FILE);
