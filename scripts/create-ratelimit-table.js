const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
const connectionString = match[1].trim();

const client = new Client({ connectionString });

const SQL = `
CREATE TABLE IF NOT EXISTS "RateLimit" (
  "key" TEXT PRIMARY KEY,
  "count" INTEGER NOT NULL DEFAULT 0,
  "resetAt" TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");
`;

(async () => {
  try {
    await client.connect();
    console.log("Connected to database");
    await client.query(SQL);
    console.log("✅ RateLimit table created");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
})();
