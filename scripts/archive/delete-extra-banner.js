const fs = require("fs");
const { Client } = require("pg");
const env = fs.readFileSync("./.env", "utf8");
const m = env.match(/DATABASE_URL="?([^"\n]+)"?/);
const c = new Client({ connectionString: m[1].trim() });
(async () => {
  await c.connect();
  const r = await c.query(`DELETE FROM "Banner" WHERE brand = 'NEW' RETURNING id, brand`);
  console.log("Deleted:", r.rowCount);
  const all = await c.query(`SELECT id, brand, "order" FROM "Banner" ORDER BY "order"`);
  console.table(all.rows);
  await c.end();
})();
