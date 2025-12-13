import { useRoute, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { portfolioItems } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import ImageSlider from "@/components/ImageSlider";
import NotFound from "./not-found";

export default function CSREvent() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/portfolio/:slug");

  if (!match) return <NotFound />;

  const item = portfolioItems.find(p => p.slug === params.slug);

  if (!item) return <NotFound />;

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-6">
        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link href="/portfolio">
            <Button variant="ghost" className="hover:text-primary pl-0 text-muted-foreground uppercase tracking-widest text-xs group">
              <ArrowLeft className="mr-2 h-4 w-4 transform group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full border-white/10 hover:bg-white/10">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-4xl mb-12">
          <div className="flex items-center gap-4 text-sm text-primary font-bold uppercase tracking-widest mb-4">
            <span className="flex items-center gap-2">
              <Tag className="h-4 w-4" /> {item.category.replace("_", " ")}
            </span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" /> {item.date}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
            {item.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {item.description}
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Slider (Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            <ImageSlider images={item.images} />
            
            {/* Additional Content Section (Simulated) */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-serif font-bold text-white mb-4">Event Details</h3>
              <p className="text-muted-foreground leading-relaxed">
                The initiative took place in the heart of the Gal Oya valley, bringing together community leaders, volunteers, and our dedicated staff.
                The focus was on long-term sustainability and immediate aid where it was needed most. Through these efforts, we aim to strengthen the bond between
                our plantation operations and the vibrant community that supports us.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/5 p-6 rounded border-l-2 border-primary">
                  <h4 className="font-bold text-white mb-2">Impact</h4>
                  <p className="text-sm text-muted-foreground">Directly benefited over 200 families in the surrounding villages.</p>
                </div>
                <div className="bg-white/5 p-6 rounded border-l-2 border-primary">
                  <h4 className="font-bold text-white mb-2">Future Goals</h4>
                  <p className="text-sm text-muted-foreground">To expand this program to 5 more villages by the end of next year.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (Span 4) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-card border border-white/5 p-8 rounded-xl sticky top-24">
              <h3 className="text-xl font-serif font-bold mb-6 border-b border-white/10 pb-4">Project Overview</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Location</label>
                  <p className="font-medium">Gal Oya Valley, Sri Lanka</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Partners</label>
                  <p className="font-medium">Local Community Council</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Duration</label>
                  <p className="font-medium">3 Days</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold">
                  Support This Cause
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
