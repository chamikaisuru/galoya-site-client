import { useTranslation } from "react-i18next";
import bottleImage from "@assets/generated_images/galoya_reserve_bottle.png";

export default function Brand() {
  const { t } = useTranslation();

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
        
        <div className="bg-primary/5 border border-primary/10 p-12 text-center rounded-lg">
          <h2 className="text-3xl font-serif font-bold mb-8 text-primary">{t("brand.awards")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[2020, 2021, 2022, 2024].map((year) => (
              <div key={year} className="space-y-2">
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-primary flex items-center justify-center">
                  <span className="font-serif font-bold text-xl text-primary">{year}</span>
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Gold Medal</p>
                <p className="text-xs text-muted-foreground/60">London Spirits Competition</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
