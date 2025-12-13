import { useTranslation } from "react-i18next";
import distilleryImage from "@assets/generated_images/copper_pot_stills_distillery.png";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="pt-12 pb-24">
      {/* Header */}
      <div className="container mx-auto px-6 mb-20">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-center mb-6">{t("about.title")}</h1>
        <div className="h-1 w-24 bg-primary mx-auto" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-primary">{t("about.story_title")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.story_text")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Since 1980, Galoya Plantations has been at the forefront of the Sri Lankan spirits industry. Our journey began with a vision to create a world-class spirit from the rich, fertile soils of the Gal Oya valley. Today, we are proud to produce some of the finest arracks in the world, exported to connoisseurs across the globe.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border border-primary/20 transform rotate-3" />
            <img 
              src={distilleryImage} 
              alt="Distillery" 
              className="relative w-full aspect-[4/3] object-cover shadow-2xl"
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-32 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-serif font-bold">{t("about.team_title")}</h2>
          <p className="text-lg text-muted-foreground">
            {t("about.team_text")}
          </p>
        </div>
      </div>
    </div>
  );
}
