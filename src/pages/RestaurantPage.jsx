import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMenu, fetchRestaurants } from "../api/api";
import MenuItem from "../components/MenuItem";
import Loader from "../components/Loader";

const RestaurantPage = () => {
  const { id } = useParams(); // Get restaurant ID from URL params
  const [menu, setMenu] = useState([]); // Menu items state
  const [rest, setRest] = useState(null); // Restaurant details state
  const [loading, setLoading] = useState(true); // Loading state
  const [err, setErr] = useState(null); // Error state

  // Fetch restaurant details and menu when component mounts or ID changes
  useEffect(() => {
    (async () => {
      try {
        const [restaurants, items] = await Promise.all([
          fetchRestaurants(), // Fetch all restaurants
          fetchMenu(id),      // Fetch menu for this restaurant
        ]);

        // Find restaurant details by ID
        setRest(restaurants.find((r) => String(r.id) === String(id)) || null);

        // Set menu items
        setMenu(items);
      } catch (e) {
        setErr(e.message); // Set error if fetch fails
      } finally {
        setLoading(false); // Stop loading
      }
    })();
  }, [id]);

  // Show loader while fetching
  if (loading) return <Loader />;

  // Show error message if fetching fails
  if (err) return <p className="error">{err}</p>;

  return (
    <div className="container section">
      {/* Page header with restaurant name, address, and back link */}
      <div className="pageHeader">
        <div>
          <h2>{rest?.name || "Restaurant"}</h2>
          <p className="muted">{rest?.address}</p>
        </div>
        <Link to="/" className="btn btn--light">← Back</Link>
      </div>

      {/* Menu items grid */}
      <div className="main-content">
        <div className="grid">
          {menu.map((m) => (
            <MenuItem key={m.id} item={m} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
