import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useTranslation } from "react-i18next";
import heroImage from "@assets/generated_images/luxury_arrack_bottle_hero_shot.png";
import plantationImage from "@assets/generated_images/sugarcane_plantation_landscape.png";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero 
        title={t("home.hero_title")}
        subtitle={t("home.hero_subtitle")}
        ctaText={t("home.cta_learn")}
        image={heroImage}
      />

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
              {t("brand.title")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              {t("home.featured_title")}
            </h2>
            <div className="h-1 w-20 bg-primary mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                abv={product.abv}
                description={product.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Production Highlight */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={plantationImage} 
            alt="Plantation" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 flex items-center">
          <div className="max-w-xl space-y-8">
            <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
              {t("sustainability.title")}
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              {t("home.production_title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("home.production_desc")}
            </p>
            <Link href="/sustainability">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-black uppercase tracking-widest text-sm px-8 py-6">
                {t("home.cta_learn")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
