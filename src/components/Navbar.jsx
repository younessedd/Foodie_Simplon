import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [open, setOpen] = useState(false); // State to toggle mobile menu
  const cartItems = useSelector((s) => s.cart.items); // Get cart items from Redux
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0); // Total items in cart
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToRestaurants = (e) => {
    e.preventDefault();
    setOpen(false);
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait a bit for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById('restaurants');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're already on home page, just scroll
      const element = document.getElementById('restaurants');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="nav">
      <div className="nav__inner">
        {/* Brand / Logo */}
        <Link to="/" className="brand">
          FoodieApp
        </Link>

        {/* Toggle button for small screens */}
        <button className="nav__toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {/* Navigation links */}
        <div className={`nav__links ${open ? "open" : ""}`}>
          {/* Home link */}
          <Link to="/" onClick={scrollToTop}>Home</Link>

          {/* Restaurants link */}
          <a href="#restaurants" onClick={scrollToRestaurants}>Restaurants</a>

          {/* About link (commented out for now) */}
          {/* <Link to="/about" onClick={() => setOpen(false)}>About</Link> */}
        
          {/* Cart link with badge showing total items */}
          <Link to="/cart" className="badge" onClick={() => setOpen(false)}>
            🛒 {cartCount}
          </Link>
        </div>
      </div>
    </nav>
  );
}
