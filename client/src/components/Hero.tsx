import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
}

export default function Hero({ title, subtitle, ctaText, image }: HeroProps) {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[20s] ease-linear hover:scale-100"
        style={{ backgroundImage: `url(${image})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
      
      {/* Content */}
      <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-start z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl space-y-6"
        >
          <div className="h-1 w-20 bg-primary mb-6" />
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight drop-shadow-lg">
            {title}
          </h1>
          <p className="text-lg md:text-2xl text-white/90 font-light leading-relaxed max-w-xl">
            {subtitle}
          </p>
          <div className="pt-8">
            <Link href="/about">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 text-lg px-8 py-6 rounded-none uppercase tracking-widest font-bold">
                {ctaText}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
