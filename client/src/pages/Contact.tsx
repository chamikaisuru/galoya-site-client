import { useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();

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
                    <p className="text-muted-foreground">Galoya Plantations<br/>Hingurana, Ampara<br/>Sri Lanka</p>
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

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
              <span className="text-muted-foreground uppercase tracking-widest text-sm">Google Maps Embed Placeholder</span>
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
