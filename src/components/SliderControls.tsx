import React from "react";

interface SliderControlsProps {
  currentSlide: number;
  totalSlides: number;
  onChange: (index: number) => void;
}

const SliderControls: React.FC<SliderControlsProps> = ({ currentSlide, totalSlides, onChange }) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-4">
      <button
        onClick={() => onChange((currentSlide - 1 + totalSlides) % totalSlides)}
        className="text-red-600 hover:text-red-700 transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <div className="flex space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onChange(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-red-600" : "bg-zinc-600 hover:bg-zinc-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <button
        onClick={() => onChange((currentSlide + 1) % totalSlides)}
        className="text-red-600 hover:text-red-700 transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>
  );
};

export default SliderControls;