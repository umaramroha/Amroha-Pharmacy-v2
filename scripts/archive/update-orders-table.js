const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
const connectionString = match[1].trim();

const client = new Client({ connectionString });

const SQL = `
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "subtotal" DECIMAL(65,30) NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveryFee" DECIMAL(65,30) NOT NULL DEFAULT 0;
`;

(async () => {
  try {
    await client.connect();
    console.log("Connected to database");
    await client.query(SQL);
    console.log("✅ Order table updated with new columns");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
})();
