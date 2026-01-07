import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurants } from "../redux/restaurantsSlice";
import RestaurantCard from "../components/RestaurantCard";
import Loader from "../components/Loader";
import Hero from "../components/Hero";

const HomePage = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((s) => s.restaurants);

  useEffect(() => {
    dispatch(getRestaurants());
  }, [dispatch]);

  return (
    <>
      {/* Hero section always visible */}
      <Hero />

      {/* Restaurant list */}
      <section id="restaurants" className="container section">
        <h2 className="section__title">Restaurants</h2>

        {loading && <Loader />}
        {error && <p className="error">⚠️ {error}</p>}

        <div className="grid">
          {data.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
