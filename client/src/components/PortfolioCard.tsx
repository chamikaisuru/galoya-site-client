import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface PortfolioCardProps {
  title: string;
  category: string;
  image: string;
  date: string;
  slug: string;
  description: string;
}

export default function PortfolioCard({ title, category, image, date, slug, description }: PortfolioCardProps) {
  return (
    <Link href={`/portfolio/${slug}`}>
      <div className="group cursor-pointer block h-full">
        <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-4 bg-white/5">
          <img 
            src={image} 
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <span className="inline-flex items-center text-white border border-white/30 px-6 py-2 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-colors">
                View Project <ArrowRight className="ml-2 h-3 w-3" />
              </span>
            </div>
          </div>
          <div className="absolute top-4 left-4">
             <span className="bg-black/70 backdrop-blur text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
               {category}
             </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <span className="text-xs text-muted-foreground font-mono pt-1">{date}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
