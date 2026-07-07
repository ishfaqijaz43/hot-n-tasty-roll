// Update the Hero Section to include navigation controls
<Carousel
  images={bannerImages}
  autoPlay={true}
  interval={5000}
  className="mt-16 max-w-7xl mx-auto px-4"
/>
  <SliderControls
    currentSlide={currentSlide}
    totalSlides={bannerImages.length}
    onChange={setCurrentSlide}
  />