import { useState } from "react";
import { useTranslation } from "react-i18next";
import { galleryImages } from "@/data/products";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, GraduationCap, Calendar } from "lucide-react";

export default function Gallery() {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Use the existing images but categorized for the mockup
  const csrImages = [
    { src: galleryImages[1], title: "Community Farming Support", date: "2024" },
    { src: galleryImages[4], title: "School Supplies Donation", date: "2024" },
  ];

  const eventImages = [
    { src: galleryImages[0], title: "Annual Harvest Festival", date: "2023" },
    { src: galleryImages[2], title: "New Year Celebration", date: "2024" },
    { src: galleryImages[3], title: "Distillery Tour Day", date: "2023" },
  ];

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{t("gallery.title")}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t("gallery.subtitle")}</p>
          <div className="h-1 w-24 bg-primary mx-auto" />
        </div>

        <Tabs defaultValue="csr" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/5 border border-white/10 p-1 h-auto rounded-full">
              <TabsTrigger 
                value="csr" 
                className="rounded-full px-8 py-3 text-sm uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all"
              >
                {t("gallery.csr_title")}
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="rounded-full px-8 py-3 text-sm uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all"
              >
                {t("gallery.events_title")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="csr" className="space-y-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
               <h2 className="text-3xl font-serif font-bold mb-4 flex items-center justify-center gap-3">
                 <Heart className="text-primary h-8 w-8" />
                 {t("gallery.csr_title")}
               </h2>
               <p className="text-muted-foreground">
                 {t("gallery.csr_desc")}
               </p>
            </div>

            {/* CSR Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {csrImages.map((item, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-xl bg-card border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => setSelectedImage(item.src)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold font-serif group-hover:text-primary transition-colors">{item.title}</h3>
                      <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-primary">{item.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dedicated to improving the lives of our plantation workers and their families through sustainable initiatives.
                    </p>
                    <div className="mt-4 flex gap-2">
                       <span className="text-xs uppercase tracking-wider text-muted-foreground/60 border border-white/10 px-2 py-1 rounded">Community</span>
                       <span className="text-xs uppercase tracking-wider text-muted-foreground/60 border border-white/10 px-2 py-1 rounded">Growth</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats / Impact Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-primary/5 border border-primary/10 p-8 rounded-lg text-center">
                 <GraduationCap className="h-8 w-8 mx-auto text-primary mb-4" />
                 <div className="text-3xl font-bold font-serif mb-1">500+</div>
                 <div className="text-sm uppercase tracking-widest text-muted-foreground">Students Supported</div>
              </div>
              <div className="bg-primary/5 border border-primary/10 p-8 rounded-lg text-center">
                 <Users className="h-8 w-8 mx-auto text-primary mb-4" />
                 <div className="text-3xl font-bold font-serif mb-1">200+</div>
                 <div className="text-sm uppercase tracking-widest text-muted-foreground">Families Employed</div>
              </div>
              <div className="bg-primary/5 border border-primary/10 p-8 rounded-lg text-center">
                 <Heart className="h-8 w-8 mx-auto text-primary mb-4" />
                 <div className="text-3xl font-bold font-serif mb-1">10+</div>
                 <div className="text-sm uppercase tracking-widest text-muted-foreground">Medical Camps</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
               <h2 className="text-3xl font-serif font-bold mb-4 flex items-center justify-center gap-3">
                 <Calendar className="text-primary h-8 w-8" />
                 {t("gallery.events_title")}
               </h2>
               <p className="text-muted-foreground">
                 {t("gallery.events_desc")}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventImages.map((item, index) => (
                <div 
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-white/5"
                  onClick={() => setSelectedImage(item.src)}
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                    <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1">{item.date}</span>
                    <h3 className="text-white font-serif text-lg font-bold">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl bg-transparent border-none p-0 overflow-hidden shadow-none flex items-center justify-center">
             {selectedImage && (
               <img 
                 src={selectedImage} 
                 alt="Full size" 
                 className="w-auto h-auto max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
               />
             )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
