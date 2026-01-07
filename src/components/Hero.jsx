import React from "react";

const Hero = () => {
  const scrollToRestaurants = (e) => {
    e.preventDefault();
    const element = document.getElementById('restaurants');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="hero">
      <div className="overlay" />
      <div className="hero__content">
        <h1>Discover Restaurants with Stunning Photos</h1>
        <p>Add your images in public/images or fetch from Unsplash automatically.</p>
        <a href="#restaurants" className="btn btn--black" onClick={scrollToRestaurants}>
          Explore Now
        </a>
      </div>
    </header>
  );
};

export default Hero;
