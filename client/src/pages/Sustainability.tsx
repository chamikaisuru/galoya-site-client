import { useTranslation } from "react-i18next";
import plantationImage from "@assets/generated_images/sugarcane_plantation_landscape.png";
import { Leaf, Droplets, Users, Recycle } from "lucide-react";

export default function Sustainability() {
  const { t } = useTranslation();

  const practices = [
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Sustainable Farming",
      desc: "We use organic farming methods, minimizing chemical inputs and promoting soil health through crop rotation."
    },
    {
      icon: <Droplets className="h-8 w-8 text-primary" />,
      title: "Water Conservation",
      desc: "Our irrigation systems are optimized to reduce water usage, and we treat and recycle wastewater from the distillery."
    },
    {
      icon: <Recycle className="h-8 w-8 text-primary" />,
      title: "Zero Waste",
      desc: "Bagasse, the fibrous residue from crushed cane, is used to fuel our boilers, creating a closed-loop energy system."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Growth",
      desc: "We support over 200 local families through direct employment and community development programs."
    }
  ];

  return (
    <div className="pb-24">
       {/* Hero */}
       <div className="relative h-[60vh] w-full overflow-hidden mb-24">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${plantationImage})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">{t("sustainability.title")}</h1>
          <p className="text-xl text-white/80 max-w-2xl">
             Honoring the land that gives us our spirit.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold mb-6">{t("sustainability.plantation_title")}</h2>
            <div className="h-1 w-20 bg-primary mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("sustainability.plantation_text")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Gal Oya valley provides the perfect microclimate for sugarcane. The hot days and cool nights concentrate the sugars in the cane, resulting in a richer, more flavorful juice. We harvest by hand to select only the peak maturity stalks, ensuring the highest quality raw material for our fermentation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             {practices.map((item, i) => (
               <div key={i} className="bg-card p-8 rounded-lg border border-white/5 hover:border-primary/30 transition-colors">
                 <div className="mb-4">{item.icon}</div>
                 <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                 <p className="text-sm text-muted-foreground">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-12 md:p-24 text-center">
          <h2 className="text-4xl font-serif font-bold mb-8">{t("sustainability.community_title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            {t("sustainability.community_text")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             {[
               { val: "200+", label: "Families Supported" },
               { val: "100%", label: "Local Sourcing" },
               { val: "40yr", label: "Legacy" }
             ].map((stat, i) => (
               <div key={i}>
                 <div className="text-5xl font-serif font-bold text-primary mb-2">{stat.val}</div>
                 <div className="text-sm uppercase tracking-widest text-muted-foreground">{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
