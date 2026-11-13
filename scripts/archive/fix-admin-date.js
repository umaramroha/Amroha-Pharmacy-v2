const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
const connectionString = match[1].trim();

const client = new Client({ connectionString });

(async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    // Pehle dekho current state
    const before = await client.query(
      'SELECT id, email, "createdAt" FROM "AdminUser"'
    );
    console.log("\n=== Before ===");
    console.table(before.rows);

    // Fix — jahan createdAt null hai wahan ab set karo
    const result = await client.query(
      'UPDATE "AdminUser" SET "createdAt" = NOW() WHERE "createdAt" IS NULL'
    );
    console.log(`\n✅ Fixed ${result.rowCount} admin record(s)`);

    // Verify
    const after = await client.query(
      'SELECT id, email, "createdAt" FROM "AdminUser"'
    );
    console.log("\n=== After ===");
    console.table(after.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
})();
