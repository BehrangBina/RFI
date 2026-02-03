import { useState, useEffect } from 'react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  orderIndex: number;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const HeroCarousel = ({ slides }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play: change slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={`http://localhost:5000${slide.imageUrl}`}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-4xl mx-auto px-4 text-center text-white">
                {slide.subtitle && (
                  <p className="text-lg md:text-xl mb-2 font-semibold text-[#46A2B9]">
                    {slide.subtitle}
                  </p>
                )}
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                )}
                {slide.buttonText && slide.buttonLink && (
                  <a
                    href={slide.buttonLink}
                    className="inline-block bg-[#46A2B9] hover:bg-[#3a8a9e] text-white font-semibold px-8 py-3 rounded-lg transition"
                  >
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition backdrop-blur"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition backdrop-blur"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
