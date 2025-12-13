import { readFileSync } from "fs";
import { join } from "path";
import pg from "pg";
import { config } from "dotenv";

// Load .env file from project root
config();

const { Pool } = pg;

async function migrate() {
  // Verify DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL is not defined!");
    console.error("Please ensure .env file exists in project root with DATABASE_URL");
    process.exit(1);
  }

  console.log("✓ DATABASE_URL loaded successfully");
  
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