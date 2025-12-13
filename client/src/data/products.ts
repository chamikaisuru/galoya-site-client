import heroImage from "@assets/generated_images/luxury_arrack_bottle_hero_shot.png";
import plantationImage from "@assets/generated_images/sugarcane_plantation_landscape.png";
import bottle1 from "@assets/generated_images/galoya_original_bottle.png";
import bottle2 from "@assets/generated_images/galoya_reserve_bottle.png";
import distillery from "@assets/generated_images/copper_pot_stills_distillery.png";

export const products = [
  {
    id: "galoya-original",
    name: "Galoya Arrack Original",
    slug: "galoya-original",
    abv: "36.8% ABV",
    image: bottle1,
    description: "A smooth, mellow spirit distilled from pure sugarcane syrup. Aged in Halmilla vats for a distinctive character.",
    ingredients: "100% Sugarcane Syrup, Water",
    tastingNotes: "Honey, Caramel, Vanilla",
    longDescription: "Our flagship spirit, Galoya Arrack Original is a testament to the purity of our ingredients. Harvested from our own estates, the sugarcane is crushed and fermented within 24 hours to preserve its fresh, grassy notes. Distilled in traditional copper pot stills and aged in Halmilla wood vats, it develops a rich golden hue and a smooth, mellow finish that is perfect for sipping neat or in cocktails."
  },
  {
    id: "galoya-reserve",
    name: "Galoya Reserve",
    slug: "galoya-reserve",
    abv: "40% ABV",
    image: bottle2,
    description: "A premium blend aged for 15 years. Rich, complex, and full-bodied with notes of dried fruit and spice.",
    ingredients: "Aged Sugarcane Spirits, Water",
    tastingNotes: "Dried Fig, Oak, Cinnamon, Dark Chocolate",
    longDescription: "Galoya Reserve is our masterpiece. Selected from our finest barrels, some aged for over 15 years, this reserve blend offers a complexity that rivals fine whiskies and cognacs. The deep amber liquid reveals layers of flavor, from dried fruits and toasted oak to subtle spices and dark chocolate. It is a spirit to be savored slowly, a true reflection of the distiller's art."
  },
  {
    id: "galoya-white",
    name: "Galoya White Label",
    slug: "galoya-white",
    abv: "35% ABV",
    image: bottle1, // Reusing bottle 1 for now as placeholder
    description: "A crystal clear spirit, double distilled for purity. Crisp and clean, ideal for tropical cocktails.",
    ingredients: "Sugarcane Spirits, Water",
    tastingNotes: "Citrus, Fresh Cane, White Pepper",
    longDescription: "For those who prefer a lighter touch, Galoya White Label offers the pure essence of sugarcane without the influence of wood aging. Crystal clear and brilliantly crisp, it captures the fresh, grassy notes of the cane field. Double distilled for exceptional purity, it makes an excellent base for refreshing tropical cocktails."
  }
];

export const galleryImages = [
  distillery,
  plantationImage,
  bottle1,
  bottle2,
  heroImage
];
