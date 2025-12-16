import { useTranslation } from "react-i18next";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function Products() {
  const { t } = useTranslation();
  
  // ✅ Fetch products from database API
  const { data: products, isLoading, error } = useProducts();

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            {t("products.title")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t("products.subtitle")}
          </p>
          <div className="inline-block px-6 py-3 border border-primary/30 bg-primary/5 rounded text-primary text-sm font-bold tracking-widest uppercase">
            {t("products.no_sales")}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-96 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Failed to Load Products</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No products available at the moment
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id}
                    id={product.slug}
                    name={product.name}
                    image={product.image}
                    abv={product.abv}
                    description={product.description}
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