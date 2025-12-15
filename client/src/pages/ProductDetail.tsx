import { useRoute, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "./not-found";

export default function ProductDetail() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/products/:slug");

  // Fetch product from database using slug
  const { data: product, isLoading } = useProduct(params?.slug || "");

  if (!match) return <NotFound />;

  if (isLoading) {
    return (
      <div className="pt-12 pb-24">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-32 mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <Skeleton className="h-[600px] lg:h-[800px] rounded-lg" />
            <div className="space-y-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <NotFound />;

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <Link href="/products">
            <Button variant="ghost" className="hover:text-primary pl-0 text-muted-foreground uppercase tracking-widest text-xs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collection
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Image */}
          <div className="relative h-[600px] lg:h-[800px] bg-white/5 rounded-lg flex items-center justify-center p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full object-contain relative z-10 drop-shadow-2xl"
            />
          </div>

          {/* Content */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-primary font-bold text-xl block">{product.abv}</span>
              <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight">{product.name}</h1>
              <div className="h-1 w-20 bg-primary" />
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              {product.longDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-white/10">
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">{t("products.details.ingredients")}</h3>
                <p className="text-muted-foreground">{product.ingredients}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Tasting Notes</h3>
                <p className="text-muted-foreground">{product.tastingNotes}</p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-6 rounded flex items-start gap-4">
              <Info className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-primary mb-1">{t("products.details.distribution")}</h4>
                <p className="text-sm text-primary/80 leading-relaxed">
                  {t("products.no_sales")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}