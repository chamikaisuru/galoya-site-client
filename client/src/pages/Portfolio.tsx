import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePortfolio } from "@/hooks/usePortfolio";
import PortfolioCard from "@/components/PortfolioCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

type Category = "all" | "csr" | "plantation" | "distillery" | "bottle_shots";

export default function Portfolio() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Category>("all");
  
  // Fetch portfolio items from database
  const { data: portfolioItems, isLoading, error } = usePortfolio();

  const categories: { value: Category; label: string }[] = [
    { value: "all", label: "All Projects" },
    { value: "csr", label: "CSR Events" },
    { value: "plantation", label: "Plantation" },
    { value: "distillery", label: "Distillery" },
    { value: "bottle_shots", label: "Bottle Shots" },
  ];

  const filteredItems = portfolioItems 
    ? filter === "all" 
      ? portfolioItems 
      : portfolioItems.filter(item => item.category === filter)
    : [];

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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Failed to Load Portfolio</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        )}

        {/* Portfolio Grid */}
        {!isLoading && !error && (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No items found in this category</p>
              </div>
            ) : (
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
            )}
          </>
        )}
      </div>
    </div>
  );
}