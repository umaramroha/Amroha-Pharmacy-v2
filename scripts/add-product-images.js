const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const envContent = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
const client = new Client({ connectionString: match[1].trim() });

const SQL = `
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
`;

(async () => {
  try {
    await client.connect();
    console.log("Connected to database");
    await client.query(SQL);
    console.log("✅ Product table updated with 'images' array column");

    // Verify
    const res = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns 
       WHERE table_name = 'Product' AND column_name IN ('image', 'images')
       ORDER BY column_name`
    );
    console.log("\n=== Verify ===");
    console.table(res.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
})();
