import React, { useEffect, useState } from "react";
import "./HeroSlider.scss";

const banners = [
  {
    id: 1,
    title: "Build Your Business Today",
    subtitle: "Start earning with our  e-Commerce Platform",
    description:
      "Join our growing community and earn by selling premium products and building your network",
    image:
      "	https://admin.buyliv.in/media/products/jewelry-concept-closeup-portrait-wedding-necklace-female-neck.jpg",
    ctaText: "Join Now",
    // ctaLink: "/register",
  },
  {
    id: 2,
    title: "Where quality meets excellence",
    subtitle: "Products people trust and love",
    description:
      "Offer premium, high-demand products that help you grow repeat customers and commissions",
    image:
      "https://admin.buyliv.in/media/products/gallery/wooden-dipper-sticky-honey.jpg",
    // ctaText: "View Products",
    // ctaLink: "/products",
  },
  {
    id: 3,
    title: "Earn More with Your Network",
    subtitle: "Unlimited income potential",
    description:
      "Grow your team, track performance, and earn rewards through our transparent  system",
    image:
      "https://admin.buyliv.in/media/products/Hair_Oil_2.jpg",
    // ctaText: "Learn How It Works",
    // ctaLink: "/how-it-works",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 2000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % banners.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handlePrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <section className="hero-slider">
      <div className="slider-container">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`slider-slide ${
                currentSlide === index ? "active" : ""
              }`}
            >
              <div className="slide-background">
                <img src={banner.image} alt={banner.title} />
                <div className="slide-overlay"></div>
              </div>
              <div className="slide-content">
                <div className="content-wrapper">
                  {/* <span className="slide-badge">Exclusive Offer</span> */}
                  <h1 className="slide-title">{banner.title}</h1>
                  <h2 className="slide-subtitle">{banner.subtitle}</h2>
                  <p className="slide-description">{banner.description}</p>
                  {/* <button
                    className="slide-cta"
                    // onClick={() => (window.location.href = banner.ctaLink)}
                  >
                    {banner.ctaText}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7.5 15L12.5 10L7.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          className="slider-arrow slider-arrow-left"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="slider-arrow slider-arrow-right"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className="slider-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="dot-progress"></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
