import { useState } from "react";
import { useTranslation } from "react-i18next";
import { portfolioItems, Category } from "@/data/portfolio";
import PortfolioCard from "@/components/PortfolioCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Portfolio() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Category>("all");

  const categories: { value: Category; label: string }[] = [
    { value: "all", label: "All Projects" },
    { value: "csr", label: "CSR Events" },
    { value: "plantation", label: "Plantation" },
    { value: "distillery", label: "Distillery" },
    { value: "bottle_shots", label: "Bottle Shots" },
  ];

  const filteredItems = filter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{t("portfolio.title")}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t("portfolio.subtitle")}</p>
          <div className="h-1 w-24 bg-primary mx-auto" />
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-16 overflow-x-auto pb-4">
          <div className="bg-white/5 border border-white/10 p-1 rounded-full whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-6 py-3 rounded-full text-sm uppercase tracking-widest transition-all duration-300 ${
                  filter === cat.value 
                    ? "bg-primary text-black font-bold shadow-[0_0_20px_rgba(218,165,32,0.3)]" 
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <PortfolioCard
              key={item.id}
              slug={item.slug}
              title={item.title}
              category={item.category.replace("_", " ")}
              image={item.thumbnail}
              date={item.date}
              description={item.description}
            />
          ))}
        </div>

        {/* WordPress / Elementor Note (Development only) */}
        <div className="mt-24 pt-12 border-t border-white/5 text-center text-muted-foreground/40 text-xs font-mono">
          <p>Dev Note: Structure optimized for future WordPress + Elementor migration.</p>
        </div>
      </div>
    </div>
  );
}
