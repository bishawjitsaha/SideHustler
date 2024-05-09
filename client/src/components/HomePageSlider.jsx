import React, { useState, useEffect, useRef } from "react";
import img1 from '/imgs/img1.png';
import img2 from '/imgs/img2.png'
import img3 from '/imgs/img3.png'
import img4 from '/imgs/img4.png'
const images = [
  img1,
  img2,
  img3,
  img4
];

const slides = [images[images.length - 1], ...images, images[0]];

function HomePageSlider() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const sliderRef = useRef(null);
  const transitionTime = 1500;

  const goToNext = () => {
    if (currentIndex >= slides.length - 1) {
      setCurrentIndex(1);
      sliderRef.current.style.transition = 'none';
    } else {
      setCurrentIndex(currentIndex + 1);
      sliderRef.current.style.transition = `transform ${transitionTime}ms ease-in-out`;
    }
  };

  const goToPrev = () => {
    if (currentIndex <= 0) {
      setCurrentIndex(slides.length - 2);
      sliderRef.current.style.transition = 'none';
    } else {
      setCurrentIndex(currentIndex - 1);
      sliderRef.current.style.transition = `transform ${transitionTime}ms ease-in-out`;
    }
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 2000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const slider = sliderRef.current;
    const transitionEnd = () => slider.style.transition = 'none';

    slider.addEventListener('transitionend', transitionEnd);

    return () => {
      slider.removeEventListener('transitionend', transitionEnd);
    };
  }, []);

  return (
    <div className="relative w-full max-w-full mx-auto">
      <div className="slider-container bg-white shadow-lg rounded-lg overflow-hidden">
        <div
          ref={sliderRef}
          className="flex"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((image, index) => (
            <div key={index} className="slider-item flex-shrink-0 w-full">
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={goToPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 bg-black bg-opacity-50 text-white rounded-r-lg"
        style={{ zIndex: 10 }}
      >
        &#x2190;
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 bg-black bg-opacity-50 text-white rounded-l-lg"
        style={{ zIndex: 10 }}
      >
        &#x2192;
      </button>
    </div>
  );
}

export default HomePageSlider;