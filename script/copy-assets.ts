import { cp } from "fs/promises";
import { resolve } from "path";

async function copyAssets() {
  const srcDir = resolve(process.cwd(), "attached_assets");
  const destDir = resolve(process.cwd(), "client", "public", "attached_assets");

  try {
    console.log("📁 Copying attached_assets to public folder...");
    
    await cp(srcDir, destDir, { 
      recursive: true,
      force: true 
    });
    
    console.log("✅ Assets copied successfully!");
  } catch (error) {
    console.error("❌ Failed to copy assets:", error);
    process.exit(1);
  }
}

copyAssets();