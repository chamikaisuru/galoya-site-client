import { config } from "dotenv";
import { db } from "./db";
import { portfolioItems, products } from "@shared/schema";

// Load .env file from project root
config();

async function seed() {
  // Verify DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL is not defined!");
    console.error("Please ensure .env file exists in project root with DATABASE_URL");
    process.exit(1);
  }

  console.log("✓ DATABASE_URL loaded successfully");
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(portfolioItems);
    await db.delete(products);

    // Portfolio Items Data
    const portfolioData = [
      {
        slug: "school-supplies-donation-2024",
        title: "Supporting Future Generations",
        category: "csr",
        thumbnail: "/attached_assets/generated_images/csr_school_donation_event.png",
        date: "January 2024",
        description: "Providing school supplies and scholarships to over 500 children in the Gal Oya community.",
        images: [
          "/attached_assets/generated_images/csr_school_donation_event.png",
          "/attached_assets/generated_images/csr_medical_camp_event.png",
          "/attached_assets/generated_images/csr_tree_planting.png",
          "/attached_assets/generated_images/sugarcane_plantation_landscape.png"
        ]
      },
      {
        slug: "community-medical-camp-2024",
        title: "Annual Health & Wellness Camp",
        category: "csr",
        thumbnail: "/attached_assets/generated_images/csr_medical_camp_event.png",
        date: "March 2024",
        description: "Free medical checkups and eye clinics for our plantation workers and their families.",
        images: [
          "/attached_assets/generated_images/csr_medical_camp_event.png",
          "/attached_assets/generated_images/csr_school_donation_event.png",
          "/attached_assets/generated_images/csr_tree_planting.png",
          "/attached_assets/generated_images/copper_pot_stills_distillery.png"
        ]
      },
      {
        slug: "sugarcane-harvest-season",
        title: "The Great Harvest",
        category: "plantation",
        thumbnail: "/attached_assets/generated_images/sugarcane_plantation_landscape.png",
        date: "August 2023",
        description: "Scenes from our annual sugarcane harvest, where tradition meets precision agriculture.",
        images: [
          "/attached_assets/generated_images/sugarcane_plantation_landscape.png",
          "/attached_assets/generated_images/csr_tree_planting.png",
          "/attached_assets/generated_images/luxury_arrack_bottle_hero_shot.png"
        ]
      },
      {
        slug: "art-of-distillation",
        title: "The Art of Distillation",
        category: "distillery",
        thumbnail: "/attached_assets/generated_images/copper_pot_stills_distillery.png",
        date: "Ongoing",
        description: "A look inside our copper pot still house where the magic happens.",
        images: [
          "/attached_assets/generated_images/copper_pot_stills_distillery.png",
          "/attached_assets/generated_images/galoya_original_bottle.png",
          "/attached_assets/generated_images/galoya_reserve_bottle.png"
        ]
      },
      {
        slug: "galoya-reserve-campaign",
        title: "Galoya Reserve Campaign",
        category: "bottle_shots",
        thumbnail: "/attached_assets/generated_images/galoya_reserve_bottle.png",
        date: "December 2023",
        description: "Promotional photography for our premium 15-year aged arrack.",
        images: [
          "/attached_assets/generated_images/galoya_reserve_bottle.png",
          "/attached_assets/generated_images/luxury_arrack_bottle_hero_shot.png",
          "/attached_assets/generated_images/galoya_original_bottle.png"
        ]
      }
    ];

    // Products Data
    const productsData = [
      {
        slug: "galoya-original",
        name: "Galoya Arrack Original",
        abv: "36.8% ABV",
        image: "/attached_assets/generated_images/galoya_original_bottle.png",
        description: "A smooth, mellow spirit distilled from pure sugarcane syrup. Aged in Halmilla vats for a distinctive character.",
        ingredients: "100% Sugarcane Syrup, Water",
        tastingNotes: "Honey, Caramel, Vanilla",
        longDescription: "Our flagship spirit, Galoya Arrack Original is a testament to the purity of our ingredients. Harvested from our own estates, the sugarcane is crushed and fermented within 24 hours to preserve its fresh, grassy notes. Distilled in traditional copper pot stills and aged in Halmilla wood vats, it develops a rich golden hue and a smooth, mellow finish that is perfect for sipping neat or in cocktails."
      },
      {
        slug: "galoya-reserve",
        name: "Galoya Reserve",
        abv: "40% ABV",
        image: "/attached_assets/generated_images/galoya_reserve_bottle.png",
        description: "A premium blend aged for 15 years. Rich, complex, and full-bodied with notes of dried fruit and spice.",
        ingredients: "Aged Sugarcane Spirits, Water",
        tastingNotes: "Dried Fig, Oak, Cinnamon, Dark Chocolate",
        longDescription: "Galoya Reserve is our masterpiece. Selected from our finest barrels, some aged for over 15 years, this reserve blend offers a complexity that rivals fine whiskies and cognacs. The deep amber liquid reveals layers of flavor, from dried fruits and toasted oak to subtle spices and dark chocolate. It is a spirit to be savored slowly, a true reflection of the distiller's art."
      },
      {
        slug: "galoya-white",
        name: "Galoya White Label",
        abv: "35% ABV",
        image: "/attached_assets/generated_images/galoya_original_bottle.png",
        description: "A crystal clear spirit, double distilled for purity. Crisp and clean, ideal for tropical cocktails.",
        ingredients: "Sugarcane Spirits, Water",
        tastingNotes: "Citrus, Fresh Cane, White Pepper",
        longDescription: "For those who prefer a lighter touch, Galoya White Label offers the pure essence of sugarcane without the influence of wood aging. Crystal clear and brilliantly crisp, it captures the fresh, grassy notes of the cane field. Double distilled for exceptional purity, it makes an excellent base for refreshing tropical cocktails."
      }
    ];

    // Insert portfolio items
    console.log("Inserting portfolio items...");
    for (const item of portfolioData) {
      await db.insert(portfolioItems).values(item);
      console.log(`✓ Added: ${item.title}`);
    }

    // Insert products
    console.log("Inserting products...");
    for (const product of productsData) {
      await db.insert(products).values(product);
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