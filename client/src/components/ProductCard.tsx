import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  abv: string;
  description: string;
}

export default function ProductCard({ id, name, image, abv, description }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden bg-card border-none hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
      </div>
      
      <CardContent className="pt-8 pb-4 text-center space-y-3">
        <div className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
          {abv}
        </div>
        <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="justify-center pb-8">
        <Link href={`/products/${id}`}>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-black group-hover:border-primary transition-all uppercase tracking-widest text-xs">
            View Details <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
