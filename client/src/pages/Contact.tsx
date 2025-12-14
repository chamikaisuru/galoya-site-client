import { useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const { t } = useTranslation();

  // Galoya Plantations, Hingurana coordinates
  const location = {
    lat: 7.223967,
    lng: 81.677320,
    name: "Galoya Plantations, Hingurana, Ampara"
  };

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{t("contact.title")}</h1>
          <div className="h-1 w-24 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-8 text-primary">{t("contact.info_title")}</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      Galoya Plantations<br/>
                      Hingurana, Ampara<br/>
                      Sri Lanka
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-muted-foreground">+94 11 234 5678</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-muted-foreground">info@galoyaarrack.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* OpenStreetMap (FREE - No API Key) */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-white/5 rounded-lg border border-white/10 overflow-hidden relative">
                {/* OpenStreetMap Embed - 100% Free */}
                <iframe
                  title="Galoya Plantations Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01}%2C${location.lat - 0.01}%2C${location.lng + 0.01}%2C${location.lat + 0.01}&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
                  style={{ border: 0 }}
                />
                
                {/* Overlay with location name */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{location.name}</span>
                  </div>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=15/${location.lat}/${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Get Directions Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`, '_blank')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Google Maps
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`https://waze.com/ul?ll=${location.lat},${location.lng}&navigate=yes`, '_blank')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Waze
                </Button>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-card p-8 md:p-12 rounded-lg border border-white/5">
             <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}