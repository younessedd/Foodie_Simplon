import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Plus } from 'lucide-react';
import { fetchMealsByCategory, fetchCategories } from '../services/api';
import { useCartStore } from '../store/cartStore';

const MealCard = ({ meal, index, addToCart }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
      <Link to={`/meal/${meal.idMeal}`}>
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4">
        <Link to={`/meal/${meal.idMeal}`}>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-1">
            {meal.strMeal}
          </h3>
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            {(Math.random() * 2 + 3).toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {Math.floor(Math.random() * 20 + 15)} min
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500">${meal.price}</span>
          <button
            onClick={() => addToCart(meal)}
            className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const CategoryPage = () => {
  const { name } = useParams();
  const [meals, setMeals] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem, toggleCart } = useCartStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [mealsData, categories] = await Promise.all([
          fetchMealsByCategory(name),
          fetchCategories(),
        ]);
        
        const cat = categories.find(c => c.name === name);
        setCategory(cat);
        
        setMeals(mealsData.map(meal => ({
          ...meal,
          price: Math.floor(Math.random() * 15 + 5),
        })));
      } catch (err) {
        console.error('Error loading category:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [name]);

  const handleAddToCart = (meal) => {
    addItem({
      id: meal.idMeal,
      name: meal.strMeal,
      price: meal.price,
      image: meal.strMealThumb,
      quantity: 1,
    });
    toggleCart();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            {category?.image && (
              <img
                src={category.image}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover shadow-lg"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{name}</h1>
              <p className="text-white/80">{meals.length} meals available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-300 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((meal, index) => (
              <MealCard
                key={meal.idMeal}
                meal={meal}
                index={index}
                addToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
        
        {!loading && meals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No meals found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
