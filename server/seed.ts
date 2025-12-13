import { db } from "./db";
import { portfolioItems, products } from "@shared/schema";
import { portfolioItems as portfolioData } from "../client/src/data/portfolio";
import { products as productsData } from "../client/src/data/products";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data (optional - remove if you don't want to reset)
    console.log("Clearing existing data...");
    await db.delete(portfolioItems);
    await db.delete(products);

    // Insert portfolio items
    console.log("Inserting portfolio items...");
    for (const item of portfolioData) {
      await db.insert(portfolioItems).values({
        slug: item.slug,
        title: item.title,
        category: item.category,
        thumbnail: item.thumbnail,
        date: item.date,
        description: item.description,
        images: item.images,
      });
      console.log(`✓ Added: ${item.title}`);
    }

    // Insert products
    console.log("Inserting products...");
    for (const product of productsData) {
      await db.insert(products).values({
        slug: product.slug,
        name: product.name,
        abv: product.abv,
        image: product.image,
        description: product.description,
        ingredients: product.ingredients,
        tastingNotes: product.tastingNotes,
        longDescription: product.longDescription,
      });
      console.log(`✓ Added: ${product.name}`);
    }

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();