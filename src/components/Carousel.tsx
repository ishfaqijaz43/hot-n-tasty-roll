import React, { useState, useEffect, useRef } from "react";

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ images, autoPlay = true, interval = 5000, className = "" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoPlay) {
      timer.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, interval);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [images, autoPlay, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
};

export default Carousel;