import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-primary">GALOYA ARRACK</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footer.address")}
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">{t("nav.about")}</Link></li>
                <li><Link href="/products" className="hover:text-primary transition-colors">{t("nav.products")}</Link></li>
                <li><Link href="/portfolio" className="hover:text-primary transition-colors">{t("nav.gallery")}</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/brand" className="hover:text-primary transition-colors">{t("nav.brand")}</Link></li>
                <li><Link href="/sustainability" className="hover:text-primary transition-colors">{t("nav.sustainability")}</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">{t("nav.contact")}</Link></li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="space-y-4">
            <div className="p-6 border border-primary/20 bg-primary/5 rounded-lg">
              <p className="text-primary/90 text-sm font-medium text-center italic">
                "{t("footer.disclaimer")}"
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            {t("footer.rights")}
          </p>
          <div className="mt-4">
             <Link href="/admin/login" className="text-[10px] text-white/10 hover:text-white/30 uppercase tracking-widest transition-colors">
                 Admin Login
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
