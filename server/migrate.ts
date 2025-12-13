import { readFileSync } from "fs";
import { join } from "path";
import pg from "pg";

const { Pool } = pg;

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("Running migrations...");
    
    const migrationSQL = readFileSync(
      join(process.cwd(), "migrations", "0000_initial.sql"),
      "utf-8"
    );

    await pool.query(migrationSQL);
    
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});