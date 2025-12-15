import { useState, useEffect, useCallback } from 'react';

interface HeroCarouselProps {
  images: string[];
  autoPlayInterval?: number;
  children?: React.ReactNode;
  className?: string;
  overlayStrength?: 'light' | 'medium' | 'strong';
  showScrollIndicator?: boolean;
}

const HeroCarousel = ({
  images,
  autoPlayInterval = 3000,
  children,
  className = '',
  overlayStrength = 'medium',
  showScrollIndicator = false,
}: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const overlayClasses = {
    light: 'bg-gradient-to-b from-black/40 via-black/30 to-black/60',
    medium: 'bg-gradient-to-b from-black/50 via-black/40 to-black/70',
    strong: 'bg-gradient-to-b from-black/60 via-black/50 to-black/80',
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        setIsAutoPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Carousel Images - Background Layer */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className={`w-full h-full object-cover transform transition-transform duration-[7000ms] ease-out ${index === currentIndex ? "scale-105" : "scale-100"}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'auto'}
              style={{
                imageRendering: '-webkit-optimize-contrast',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
            />
            {/* Overlay */}
            <div className={`absolute inset-0 ${overlayClasses[overlayStrength]}`} />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}

      {/* Custom Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${index === currentIndex ? "w-6 h-2 bg-accent rounded-full" : "w-2 h-2 bg-white/60 hover:bg-white/80 rounded-full"}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
