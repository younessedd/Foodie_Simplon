 // src/api/api.js

// Fake Restaurant API (without an API key) via proxy
const RESTAURANT_BASE = "/api/Restaurant";
// General meals list from TheMealDB
const MEAL_BASE = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Fallback to a default local image if specific restaurant image doesn't exist
const fallbackImage = `/image/restaurant-1.jpg`;

// Fetch list of restaurants
export const fetchRestaurants = async () => {
  const res = await fetch(RESTAURANT_BASE);
  if (!res.ok) throw new Error("Failed to fetch restaurants");
  const data = await res.json();

  // Normalize fields + prepare images
  return data.map((r, index) => {
    // Use index + 1 to get IDs 1-38 to match our image files
    const id = (index % 38) + 1;
    const name = r.restaurantName ?? r.name ?? "Restaurant";
    const address = r.restaurantAddress ?? r.address ?? "Address not provided";

    // Use local image that matches our available files
    const staticImage = `/image/restaurant-${id}.jpg`;
    
    return { id, name, address, image: staticImage, fallbackImage };
  });
};

// Fetch menu (using TheMealDB as general menu and assign to restaurant)
export const fetchMenu = async (restaurantId) => {
  const res = await fetch(MEAL_BASE);
  if (!res.ok) throw new Error("Failed to fetch menu");
  const data = await res.json();

  return (data.meals || []).slice(0, 12).map((meal) => ({
    id: meal.idMeal,              // Meal ID from API
    name: meal.strMeal,            // Meal name
    image: meal.strMealThumb,      // Meal image
    price: Math.floor(Math.random() * 90) + 30, // Random price for demo
    restaurantId,                  // Assign to restaurant
  }));
};
