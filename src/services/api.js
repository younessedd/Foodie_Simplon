// Multiple API services for restaurants and food data

// API 1: TheMealDB - for meals by category
const MEAL_DB_BASE = 'https://www.themealdb.com/api/json/v1/1';

// Reliable food images from Unsplash
const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
  'https://images.unsplash.com/photo-1482049016gy-2d1ec7ab7445?w=400',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400',
];

const FOOD_NAMES = [
  'Grilled Salmon', 'Margherita Pizza', 'Chocolate Cake', 'Caesar Salad', 
  'Beef Burger', 'Pasta Carbonara', 'Chicken Wings', 'Sushi Roll',
  'Tacos', 'Fried Rice', 'BBQ Ribs', 'Vegetable Stir Fry'
];

// Fallback sample data with reliable images
const SAMPLE_MEALS = FOOD_NAMES.map((name, i) => ({
  idMeal: String(52800 + i),
  strMeal: name,
  strMealThumb: FOOD_IMAGES[i],
  category: ['Italian', 'Mexican', 'Dessert', 'Healthy', 'American', 'Italian', 'American', 'Japanese', 'Mexican', 'Chinese', 'BBQ', 'Healthy'][i],
  price: Math.floor(Math.random() * 10 + 8),
}));

const SAMPLE_CATEGORIES = [
  { id: '1', name: 'Beef', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400', description: 'Beef dishes' },
  { id: '2', name: 'Chicken', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', description: 'Chicken dishes' },
  { id: '3', name: 'Dessert', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', description: 'Sweet treats' },
  { id: '4', name: 'Italian', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400', description: 'Italian cuisine' },
  { id: '5', name: 'Seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', description: 'Sea food' },
  { id: '6', name: 'Vegetarian', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', description: 'Vegetable dishes' },
  { id: '7', name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', description: 'Mexican food' },
  { id: '8', name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', description: 'Indian spices' },
];

// Fetch categories from TheMealDB
export const fetchCategories = async () => {
  return SAMPLE_CATEGORIES;
};

// Fetch meals by category
export const fetchMealsByCategory = async (category) => {
  if (category && category !== 'All') {
    try {
      const response = await fetch(`${MEAL_DB_BASE}/filter.php?c=${category}`);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        return data.meals.slice(0, 12).map((meal, i) => ({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb || SAMPLE_MEALS[i % SAMPLE_MEALS.length].strMealThumb,
          category: category,
          price: Math.floor(Math.random() * 10 + 8),
        }));
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  }
  // Return sample data with reliable images
  return SAMPLE_MEALS.map((meal, i) => ({
    ...meal,
    price: Math.floor(Math.random() * 10 + 8),
  }));
};

// Fetch meal details
export const fetchMealById = async (id) => {
  try {
    const response = await fetch(`${MEAL_DB_BASE}/lookup.php?i=${id}`);
    const data = await response.json();
    if (data.meals?.[0]) {
      return {
        ...data.meals[0],
        price: Math.floor(Math.random() * 15 + 5),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching meal details:', error);
    return null;
  }
};

// Search meals
export const searchMeals = async (query) => {
  try {
    const response = await fetch(`${MEAL_DB_BASE}/search.php?s=${query}`);
    const data = await response.json();
    return data.meals?.map(meal => ({
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      price: Math.floor(Math.random() * 15 + 5),
    })) || [];
  } catch (error) {
    console.error('Error searching meals:', error);
    return [];
  }
};

// Generate mock restaurant data (simulating multiple restaurant APIs)
export const fetchRestaurants = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const restaurantImages = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    'https://images.unsplash.com/photo-1565876241326-77c3c1a1c0da?w=400',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400',
    'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400',
    'https://images.unsplash.com/photo-1562967968-56c09c6d8c1c?w=400',
  ];

  const restaurantNames = [
    'Burger Palace', 'Pizza Heaven', 'Sushi Master', 'Taco Fiesta', 'Pasta Paradise',
    'Grill House', 'Dragon Wok', 'Mediterranean Delight', 'BBQ Station', 'Thai Orchid',
    'Golden Dragon', 'Italian Corner', 'Seafood Harbor', 'Curry House', 'Mexican Fiesta',
    'Korean BBQ', 'French Bistro', 'Vietnamese Kitchen', 'Greek Taverna', 'Indian Spice'
  ];

  const cuisines = [
    'American', 'Italian', 'Japanese', 'Mexican', 'Chinese',
    'Mediterranean', 'Indian', 'Thai', 'Korean', 'French',
    'Vietnamese', 'Greek', 'BBQ', 'Seafood', 'Fast Food'
  ];

  return restaurantNames.map((name, index) => ({
    id: `rest-${index + 1}`,
    name,
    image: restaurantImages[index % restaurantImages.length],
    cuisine: cuisines[index % cuisines.length],
    rating: (Math.random() * 2 + 3).toFixed(1),
    deliveryTime: `${Math.floor(Math.random() * 20 + 15)}-${Math.floor(Math.random() * 15 + 30)} min`,
    deliveryFee: Math.floor(Math.random() * 3 + 1),
    priceRange: '$'.repeat(Math.floor(Math.random() * 3) + 1),
    address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
    isOpen: Math.random() > 0.2,
  }));
};

// Fetch menu for a specific restaurant
export const fetchRestaurantMenu = async (restaurantId) => {
  const categories = await fetchCategories();
  const categoryIndex = parseInt(restaurantId.replace('rest-', '')) % categories.length;
  const category = categories[categoryIndex]?.strCategory || 'Beef';
  
  const meals = await fetchMealsByCategory(category);
  
  return meals.map(meal => ({
    ...meal,
    price: Math.floor(Math.random() * 20 + 8),
    description: `Delicious ${meal.name} prepared with fresh ingredients`,
    isAvailable: Math.random() > 0.1,
  }));
};

// Fetch all categories with their meals
export const fetchAllCategoriesWithMeals = async () => {
  const categories = await fetchCategories();
  const result = [];
  
  for (const category of categories.slice(0, 8)) {
    const meals = await fetchMealsByCategory(category.strCategory);
    result.push({
      ...category,
      meals: meals.slice(0, 6).map(meal => ({
        ...meal,
        price: Math.floor(Math.random() * 15 + 5),
      })),
    });
  }
  
  return result;
};

// Fetch featured restaurants
export const fetchFeaturedRestaurants = async () => {
  const restaurants = await fetchRestaurants();
  return restaurants
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 6);
};

// Fetch restaurants by cuisine
export const fetchRestaurantsByCuisine = async (cuisine) => {
  const restaurants = await fetchRestaurants();
  if (cuisine === 'All') return restaurants;
  return restaurants.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
};

// Get all unique cuisines
export const getAllCuisines = () => [
  'All', 'American', 'Italian', 'Japanese', 'Mexican', 'Chinese',
  'Mediterranean', 'Indian', 'Thai', 'Korean', 'French', 'BBQ', 'Seafood'
];
