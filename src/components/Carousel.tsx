import React from "react";

interface CarouselProps {
  images: string[];
  currentSlide: number;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ images, currentSlide, className = "" }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img 
            src={image} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80";
            }}
          />
          {/* Black gradient overlay for premium text contrast */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}
    </div>
  );
};

export default Carousel;