 // src/api/api.js

// Fake Restaurant API (without an API key) - use proxy locally, direct URL in production
const RESTAURANT_BASE = process.env.NODE_ENV === 'production' 
  ? "https://fakerestaurantapi.runasp.net/api/Restaurant"
  : "/api/Restaurant";
// General meals list from TheMealDB
const MEAL_BASE = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Fallback to a default local image if specific restaurant image doesn't exist
const fallbackImage = `/image/restaurant-1.jpg`;

// Fallback restaurant data
const fallbackRestaurants = [
  { restaurantName: "1135 AD", address: "Jaipur, Amber Fort, Rajasthan" },
  { restaurantName: "6 Ballygunge Place", address: "Kolkata, Ballygunge, West Bengal" },
  { restaurantName: "Agashiye", address: "Ahmedabad, House of MG, Gujarat" },
  { restaurantName: "Alhamdulillah Hotel", address: "Hyderabad, Sultan Shahi, Telangana" },
  { restaurantName: "Bawarchi", address: "Hyderabad, RTC Cross Road, Telangana" },
  { restaurantName: "Benjarong", address: "Chennai, Alwarpet, Tamil Nadu" },
  { restaurantName: "Britannia & Co.", address: "Mumbai, Ballard, Maharashtra" },
  { restaurantName: "Bukhara", address: "Delhi, Chanakyapuri, Delhi" },
  { restaurantName: "Dakshin", address: "Chennai, ITC Grand Chola, Tamil Nadu" },
  { restaurantName: "Gopi Dining Hall", address: "Ahmedabad, Ashram Road, Gujarat" },
  { restaurantName: "Grand Hotel", address: "Hyderabad, Abids, Telangana" },
  { restaurantName: "Indian Accent", address: "Delhi, Lodhi, Delhi" },
  { restaurantName: "Jewel of Nizam", address: "Hyderabad, Golkonda, Telangana" },
  { restaurantName: "Karim's", address: "Delhi, Jama Masjid, Delhi" },
  { restaurantName: "Koshy's", address: "Bangalore, St. Marks, Karnataka" },
  { restaurantName: "Masala Library", address: "Mumbai, Bandra, Maharashtra" },
  { restaurantName: "Mavalli Tiffin Room (MTR)", address: "Bangalore, Lal Bagh, Karnataka" },
  { restaurantName: "Mumtaz Restaurant", address: "Hyderabad, Mallepally, Telangana" },
  { restaurantName: "Murugan Idli Shop", address: "Chennai, T. Nagar, Tamil Nadu" },
  { restaurantName: "Oh! Calcutta", address: "Kolkata, Elgin, West Bengal" },
  { restaurantName: "Paradise Biryani", address: "Hyderabad, Secunderabad, Telangana" },
  { restaurantName: "Peacock Rooftop Restaurant", address: "Jaipur, C Scheme, Rajasthan" },
  { restaurantName: "Peter Cat", address: "Kolkata, Park Street, West Bengal" },
  { restaurantName: "Pista House", address: "Hyderabad, Charminar, Telangana" },
  { restaurantName: "Rajwadu", address: "Ahmedabad, Vejalpur, Gujarat" },
  { restaurantName: "Rawat Mishtan Bhandar", address: "Jaipur, Station Road, Rajasthan" },
  { restaurantName: "Sarvi Restaurant", address: "Hyderabad, Shah Ali Banda, Telangana" },
  { restaurantName: "Shah Ghouse", address: "Hyderabad, Tolichowki, Telangana" },
  { restaurantName: "The Fisherman's Wharf", address: "Hyderabad, Necklace Road, Telangana" },
  { restaurantName: "The Table", address: "Mumbai, Colaba, Maharashtra" },
  { restaurantName: "Toit Brewery", address: "Bangalore, Indiranagar, Karnataka" }
];

// Fetch list of restaurants
export const fetchRestaurants = async () => {
  try {
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
  } catch (error) {
    console.warn("API failed, using fallback data:", error.message);
    
    // Use fallback data
    return fallbackRestaurants.map((r, index) => {
      const id = (index % 38) + 1;
      const staticImage = `/image/restaurant-${id}.jpg`;
      
      return { 
        id, 
        name: r.restaurantName, 
        address: r.address, 
        image: staticImage, 
        fallbackImage 
      };
    });
  }
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
