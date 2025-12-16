import { useTranslation } from "react-i18next";
import { useAwards } from "@/hooks/useAwards";
import bottleImage from "@assets/generated_images/galoya_reserve_bottle.png";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Award, Medal } from "lucide-react";

export default function Brand() {
  const { t } = useTranslation();
  const { data: awards, isLoading } = useAwards();

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'certification':
        return <Award className="h-5 w-5" />;
      case 'competition':
        return <Trophy className="h-5 w-5" />;
      case 'recognition':
        return <Medal className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'certification':
        return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
      case 'competition':
        return 'text-primary border-primary/20 bg-primary/10';
      case 'recognition':
        return 'text-green-400 border-green-400/20 bg-green-400/10';
      default:
        return 'text-primary border-primary/20 bg-primary/10';
    }
  };

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{t("brand.title")}</h1>
          <div className="h-1 w-24 bg-primary mx-auto mb-12" />
          <p className="text-2xl font-serif italic text-primary/80 leading-relaxed">
            "{t("brand.story")}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1 relative h-[600px] bg-white/5 rounded-lg overflow-hidden flex items-center justify-center p-12">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
             <img src={bottleImage} alt="Brand Bottle" className="h-full object-contain relative z-10 drop-shadow-2xl" />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <h2 className="text-3xl font-serif font-bold text-primary">Unique Qualities</h2>
            <ul className="space-y-6">
              {[
                { title: "Single Estate", desc: "Every drop comes from sugarcane grown on our own plantation." },
                { title: "Pure Ingredients", desc: "No artificial flavors or additives. Just pure cane spirit and water." },
                { title: "Traditional Pot Stills", desc: "Distilled in copper pot stills for a richer, heavier spirit." },
                { title: "Halmilla Aging", desc: "Matured in rare Halmilla wood vats, unique to Sri Lankan arrack." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-primary font-bold text-xl">0{i+1}</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Dynamic Awards Section */}
        <div className="bg-primary/5 border border-primary/10 p-12 rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4 text-primary flex items-center justify-center gap-3">
              <Trophy className="h-10 w-10" />
              {t("brand.awards")}
            </h2>
            <p className="text-muted-foreground">Recognized globally for excellence in distillation</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-20 h-20 mx-auto rounded-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : awards && awards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {awards.map((award) => (
                <div 
                  key={award.id} 
                  className="group space-y-4 p-6 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all duration-300"
                >
                  {/* Icon/Image */}
                  <div className="mx-auto w-20 h-20 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {award.image ? (
                      <img 
                        src={award.image} 
                        alt={award.name} 
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="text-primary">
                        {getCategoryIcon(award.category)}
                      </div>
                    )}
                  </div>

                  {/* Year Badge */}
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary font-bold text-sm">
                      {award.year}
                    </span>
                  </div>

                  {/* Award Name */}
                  <h3 className="text-center font-bold text-white text-sm leading-tight min-h-[40px] flex items-center justify-center">
                    {award.name}
                  </h3>

                  {/* Organization */}
                  <p className="text-center text-xs text-muted-foreground/80 leading-relaxed min-h-[32px]">
                    {award.organization}
                  </p>

                  {/* Category Badge */}
                  <div className="text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs uppercase tracking-wider ${getCategoryColor(award.category)}`}>
                      {getCategoryIcon(award.category)}
                      {award.category}
                    </span>
                  </div>

                  {/* Description (if available) */}
                  {award.description && (
                    <p className="text-center text-xs text-muted-foreground/60 pt-2 border-t border-white/5">
                      {award.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No awards added yet</p>
              <p className="text-sm text-muted-foreground/60 mt-2">Awards will appear here once added in the admin panel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}