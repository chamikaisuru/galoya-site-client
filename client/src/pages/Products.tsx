import { useTranslation } from "react-i18next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function Products() {
  const { t } = useTranslation();

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{t("products.title")}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t("products.subtitle")}</p>
          <div className="inline-block px-6 py-3 border border-primary/30 bg-primary/5 rounded text-primary text-sm font-bold tracking-widest uppercase">
            {t("products.no_sales")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product) => (
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
    </div>
  );
}
