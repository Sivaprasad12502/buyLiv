import React, { useState } from "react";
import "./ImageSlider.scss";

const ImageSlider = ({ images, name }) => {
  const [current, setCurrent] = useState(0);

  if (!images?.length) return null;

  return (
    <div className="imageSlider">
      {images.length > 1 && (
        <button
          className="slider-arrow slider-arrow-left"
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((prev) => (prev - 1 + images.length) % images.length);
          }}
        >
          ‹
        </button>
      )}

      {/* OPEN IMAGE IN NEW TAB */}
      <a
        href={images[current].image}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={images[current].image} alt={name} />
      </a>

      {images.length > 1 && (
        <button
          className="slider-arrow slider-arrow-right"
          onClick={(e) => {
            e.stopPropagation();
            setCurrent((prev) => (prev + 1) % images.length);
          }}
        >
          ›
        </button>
      )}
    </div>
  );
};

export default ImageSlider;
