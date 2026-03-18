import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchMealsByCategory } from '../services/api';

const MealCard = ({ meal, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Link to={`/meal/${meal.idMeal}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div className="relative overflow-hidden">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ${meal.price}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1">
            {meal.strMeal}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Math.floor(Math.random() * 20 + 15)} min
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {meal.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
    <div className="h-48 bg-gray-300 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cats, allMeals] = await Promise.all([
          fetchCategories(),
          fetchMealsByCategory(''),
        ]);
        setCategories([{ strCategory: 'All' }, ...cats]);
        
        const mealsWithPrice = allMeals.map(meal => ({
          ...meal,
          price: Math.floor(Math.random() * 15 + 5),
          category: 'All',
        }));
        setMeals(mealsWithPrice);
      } catch (err) {
        setError('Failed to load meals. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadCategoryMeals = async () => {
      if (selectedCategory === 'All') {
        const allMeals = await fetchMealsByCategory('');
        setMeals(allMeals.map(meal => ({
          ...meal,
          price: Math.floor(Math.random() * 15 + 5),
          category: 'All',
        })));
        return;
      }
      
      setLoading(true);
      try {
        const meals = await fetchMealsByCategory(selectedCategory);
        setMeals(meals.map(meal => ({
          ...meal,
          price: Math.floor(Math.random() * 15 + 5),
          category: selectedCategory,
        })));
      } catch (err) {
        setError('Failed to load meals.');
      } finally {
        setLoading(false);
      }
    };
    
    if (categories.length > 0) {
      loadCategoryMeals();
    }
  }, [selectedCategory, categories.length]);

  const filteredMeals = meals.filter(meal =>
    meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Delicious Food, Delivered Fast
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Order from your favorite restaurants and get it delivered to your door in minutes
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for meals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.strCategory}
              onClick={() => setSelectedCategory(cat.strCategory)}
              className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === cat.strCategory
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat.strCategory}
            </button>
          ))}
        </div>
      </div>

      {/* Meals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredMeals.map((meal, index) => (
                <MealCard key={meal.idMeal} meal={meal} index={index} />
              ))}
        </div>

        {!loading && filteredMeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No meals found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
