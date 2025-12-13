import csr1 from "@assets/generated_images/csr_school_donation_event.png";
import csr2 from "@assets/generated_images/csr_medical_camp_event.png";
import csr3 from "@assets/generated_images/csr_tree_planting.png";
import distillery from "@assets/generated_images/copper_pot_stills_distillery.png";
import plantation from "@assets/generated_images/sugarcane_plantation_landscape.png";
import bottle1 from "@assets/generated_images/galoya_original_bottle.png";
import bottle2 from "@assets/generated_images/galoya_reserve_bottle.png";
import hero from "@assets/generated_images/luxury_arrack_bottle_hero_shot.png";

export type Category = "all" | "csr" | "plantation" | "distillery" | "bottle_shots";

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: Category;
  thumbnail: string;
  date: string;
  description: string;
  images: string[]; // For the detail page gallery/slider
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "csr-school-2024",
    slug: "school-supplies-donation-2024",
    title: "Supporting Future Generations",
    category: "csr",
    thumbnail: csr1,
    date: "January 2024",
    description: "Providing school supplies and scholarships to over 500 children in the Gal Oya community.",
    images: [csr1, csr2, csr3, plantation] // Using mix of placeholders to simulate multiple images
  },
  {
    id: "csr-medical-2024",
    slug: "community-medical-camp-2024",
    title: "Annual Health & Wellness Camp",
    category: "csr",
    thumbnail: csr2,
    date: "March 2024",
    description: "Free medical checkups and eye clinics for our plantation workers and their families.",
    images: [csr2, csr1, csr3, distillery]
  },
  {
    id: "plantation-harvest",
    slug: "sugarcane-harvest-season",
    title: "The Great Harvest",
    category: "plantation",
    thumbnail: plantation,
    date: "August 2023",
    description: "Scenes from our annual sugarcane harvest, where tradition meets precision agriculture.",
    images: [plantation, csr3, hero]
  },
  {
    id: "distillery-process",
    slug: "art-of-distillation",
    title: "The Art of Distillation",
    category: "distillery",
    thumbnail: distillery,
    date: "Ongoing",
    description: "A look inside our copper pot still house where the magic happens.",
    images: [distillery, bottle1, bottle2]
  },
  {
    id: "bottle-shoot-reserve",
    slug: "galoya-reserve-campaign",
    title: "Galoya Reserve Campaign",
    category: "bottle_shots",
    thumbnail: bottle2,
    date: "December 2023",
    description: "Promotional photography for our premium 15-year aged arrack.",
    images: [bottle2, hero, bottle1]
  }
];
