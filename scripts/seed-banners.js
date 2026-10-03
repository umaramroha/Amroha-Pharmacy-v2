const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const envContent = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
const client = new Client({ connectionString: match[1].trim() });

const banners = [
  {
    id: "banner_ayurvedic",
    brand: "AYURVEDIC RANGE",
    title: "Up to 20% off",
    subtitle: "Immunity & overall health",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
    linkUrl: "/products?category=general-problems",
    theme: "teal",
    order: 1,
  },
  {
    id: "banner_savings",
    brand: "BEST SAVINGS",
    title: "Up to 14% off",
    subtitle: "On all medicines + cashback",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300",
    linkUrl: "/products",
    theme: "blue",
    order: 2,
  },
  {
    id: "banner_mens",
    brand: "MEN'S WELLNESS",
    title: "Up to 25% off",
    subtitle: "Vitality & strength products",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300",
    linkUrl: "/products?category=male-problems",
    theme: "amber",
    order: 3,
  },
];

(async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    for (const b of banners) {
      await client.query(
        `INSERT INTO "Banner" (id, brand, title, subtitle, "imageUrl", "linkUrl", theme, "order", "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        [b.id, b.brand, b.title, b.subtitle, b.imageUrl, b.linkUrl, b.theme, b.order]
      );
      console.log("✅ Inserted:", b.brand);
    }

    const res = await client.query(`SELECT id, brand, title, theme, "order" FROM "Banner" ORDER BY "order"`);
    console.log("\n=== Banners in DB ===");
    console.table(res.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
})();
