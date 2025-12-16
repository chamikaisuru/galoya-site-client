import { config } from "dotenv";
import { db } from "./db";
import { awards } from "@shared/schema";

config();

async function debugAwards() {
  console.log("🔍 DEBUG: Awards System\n");

  try {
    // Step 1: Check database connection
    console.log("Step 1: Checking database connection...");
    const allAwards = await db.select().from(awards);
    console.log(`✅ Database connected! Found ${allAwards.length} awards\n`);

    // Step 2: Display all awards
    console.log("Step 2: Awards in database:");
    console.log("════════════════════════════════════════════");
    allAwards.forEach((award, idx) => {
      console.log(`${idx + 1}. ${award.name}`);
      console.log(`   Year: ${award.year}`);
      console.log(`   Organization: ${award.organization}`);
      console.log(`   Category: ${award.category}`);
      console.log(`   Display Order: ${award.displayOrder}`);
      console.log(`   ID: ${award.id}`);
      console.log("───────────────────────────────────────────");
    });

    // Step 3: Check storage functions
    console.log("\nStep 3: Testing storage functions...");
    const { storage } = await import("./storage");
    
    const storageAwards = await storage.getAllAwards();
    console.log(`✅ storage.getAllAwards() returned ${storageAwards.length} awards\n`);

    // Step 4: Test API endpoint simulation
    console.log("Step 4: API endpoint check:");
    console.log("───────────────────────────────────────────");
    console.log("GET /api/awards should return:");
    console.log(JSON.stringify(storageAwards, null, 2));
    console.log("───────────────────────────────────────────\n");

    // Step 5: Check if awards are properly formatted
    console.log("Step 5: Checking data structure...");
    const firstAward = storageAwards[0];
    const requiredFields = ['id', 'name', 'year', 'organization', 'category', 'displayOrder'];
    const missingFields = requiredFields.filter(field => !firstAward[field]);
    
    if (missingFields.length === 0) {
      console.log("✅ All required fields present\n");
    } else {
      console.log(`❌ Missing fields: ${missingFields.join(', ')}\n`);
    }

    // Summary
    console.log("═══════════════════════════════════════════");
    console.log("📊 SUMMARY");
    console.log("═══════════════════════════════════════════");
    console.log(`Database Awards: ${allAwards.length}`);
    console.log(`Storage Awards: ${storageAwards.length}`);
    console.log(`Categories: ${[...new Set(storageAwards.map(a => a.category))].join(', ')}`);
    console.log("\n🔧 NEXT STEPS:");
    console.log("1. Start your server: npm run dev");
    console.log("2. Open browser console (F12)");
    console.log("3. Go to: http://localhost:5174/api/awards");
    console.log("4. Check if JSON data shows");
    console.log("5. Then check admin panel: http://localhost:5174/admin/login");
    console.log("\n");

  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    console.error("\nFull error:", error);
  }

  process.exit(0);
}

debugAwards();