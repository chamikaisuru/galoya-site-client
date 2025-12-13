import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <>
      <div className="relative group">
        <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10" ref={emblaRef}>
          <div className="flex">
            {images.map((src, index) => (
              <div className="flex-[0_0_100%] min-w-0 relative aspect-video" key={index}>
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setLightboxIndex(index)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-background/80 border-none hover:bg-primary hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-background/80 border-none hover:bg-primary hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "bg-primary w-6" : "bg-white/20 hover:bg-white/40"
              }`}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-[95vw] h-[90vh] bg-transparent border-none p-0 flex items-center justify-center shadow-none">
          {lightboxIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
               <img
                src={images[lightboxIndex]}
                alt="Fullscreen"
                className="max-w-full max-h-full object-contain rounded shadow-2xl"
              />
              <Button
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-primary hover:text-black"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                 className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-primary hover:text-black"
                 size="icon"
                 onClick={(e) => {
                   e.stopPropagation();
                   setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
                 }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
