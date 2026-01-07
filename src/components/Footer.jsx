import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">FoodieApp 🍴</div>
    
        <p className="footer-copy">© 2025 FoodieApp. All rights reserved.</p>
      </div>
    </footer>
  );
}
