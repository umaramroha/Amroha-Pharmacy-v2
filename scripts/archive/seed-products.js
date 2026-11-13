const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
const connectionString = match[1].trim();

const client = new Client({ connectionString });

const products = [
  {
    id: "prod_1",
    name: "Ayurvedic Capsule",
    slug: "ayurvedic-capsule",
    price: 299,
    mrp: 399,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    category: "general-problems",
    description: "Premium Ayurvedic capsule for overall wellness. Made with 100% natural herbs.",
    stock: 100,
  },
  {
    id: "prod_2",
    name: "Herbal Safoof",
    slug: "herbal-safoof",
    price: 199,
    mrp: 249,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500",
    category: "general-problems",
    description: "Traditional Unani Safoof for daily health maintenance.",
    stock: 80,
  },
  {
    id: "prod_3",
    name: "Majoon Special",
    slug: "majoon-special",
    price: 499,
    mrp: 599,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
    category: "male-problems",
    description: "Special Majoon for men's health and vitality.",
    stock: 50,
  },
  {
    id: "prod_4",
    name: "Women Wellness Tonic",
    slug: "women-wellness-tonic",
    price: 349,
    mrp: 449,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500",
    category: "female-problems",
    description: "Specially formulated tonic for women's health and wellness.",
    stock: 60,
  },
  {
    id: "prod_5",
    name: "Unani Pills",
    slug: "unani-pills",
    price: 249,
    mrp: 299,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500",
    category: "general-problems",
    description: "Authentic Unani pills for common health issues.",
    stock: 90,
  },
  {
    id: "prod_6",
    name: "Herbal Oil",
    slug: "herbal-oil",
    price: 399,
    mrp: 499,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
    category: "general-problems",
    description: "Pure herbal oil for massage and pain relief.",
    stock: 70,
  },
  {
    id: "prod_7",
    name: "Men Power Capsule",
    slug: "men-power-capsule",
    price: 599,
    mrp: 799,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500",
    category: "male-problems",
    description: "Ayurvedic capsule to boost men's strength and stamina.",
    stock: 40,
  },
  {
    id: "prod_8",
    name: "Female Vitality Syrup",
    slug: "female-vitality-syrup",
    price: 449,
    mrp: 549,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500",
    category: "female-problems",
    description: "Natural syrup for women's vitality and hormonal balance.",
    stock: 55,
  },
];

(async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    for (const p of products) {
      await client.query(
        `INSERT INTO "Product" ("id", "name", "slug", "description", "price", "mrp", "image", "category", "stock", "isActive")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
         ON CONFLICT ("slug") DO UPDATE SET
           "name" = EXCLUDED."name",
           "description" = EXCLUDED."description",
           "price" = EXCLUDED."price",
           "mrp" = EXCLUDED."mrp",
           "image" = EXCLUDED."image",
           "category" = EXCLUDED."category",
           "stock" = EXCLUDED."stock"`,
        [p.id, p.name, p.slug, p.description, p.price, p.mrp, p.image, p.category, p.stock]
      );
      console.log(`✓ ${p.name}`);
    }

    console.log(`\n✅ ${products.length} products inserted/updated successfully`);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
})();
