import React, { useState } from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const [src, setSrc] = useState(restaurant.image);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      console.log('Image failed to load, trying fallback:', restaurant.fallbackImage);
      setSrc(restaurant.fallbackImage);
      setHasError(true);
    }
  };

  // Test with a hardcoded path first
  const testSrc = src || '/image/restaurant-1.jpg';

  return (
    // Link to the restaurant's detail page
    <Link to={`/restaurant/${restaurant.id}`} className="card restaurant">
      
      {/* Restaurant image */}
      <div className="card__image">
        <img
          src={testSrc}
          alt={restaurant.name}
          onError={handleImageError}
        />
      </div>

      {/* Restaurant information */}
      <div className="card__body">
        {/* Restaurant name */}
        <h3>{restaurant.name}</h3>

        {/* Restaurant address */}
        <p className="muted">{restaurant.address}</p>

        {/* Action button or chip */}
        <div className="card__actions">
          <span className="chip">View Menu</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
