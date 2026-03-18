import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { fetchMealById } from '../services/api';
import { useCartStore } from '../store/cartStore';

const MealDetail = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, toggleCart } = useCartStore();

  useEffect(() => {
    const loadMeal = async () => {
      try {
        setLoading(true);
        const data = await fetchMealById(id);
        if (data) {
          setMeal({
            ...data,
            price: Math.floor(Math.random() * 15 + 5),
          });
        } else {
          setError('Meal not found');
        }
      } catch (err) {
        setError('Failed to load meal details');
      } finally {
        setLoading(false);
      }
    };
    loadMeal();
  }, [id]);

  const handleAddToCart = () => {
    addItem({
      id: meal.idMeal,
      name: meal.strMeal,
      price: meal.price,
      image: meal.strMealThumb,
      quantity,
    });
    toggleCart();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg mb-4">{error || 'Meal not found'}</p>
        <Link to="/" className="text-orange-500 hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative h-72 md:h-96">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <Link
          to="/"
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {meal.strMeal}
              </h1>
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  {(Math.random() * 2 + 3).toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  {Math.floor(Math.random() * 20 + 15)} min
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  {meal.strArea}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-500">${meal.price}</div>
          </div>

          {meal.strCategory && (
            <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-1 rounded-full text-sm font-medium mb-6">
              {meal.strCategory}
            </div>
          )}

          {meal.strInstructions && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Instructions</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {meal.strInstructions}
              </p>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 -mx-6 md:-mx-8 px-6 md:px-8 -mb-6 md:-mb-8 rounded-b-3xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600 dark:text-white" />
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-700 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-white" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/30"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart - ${meal.price * quantity}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MealDetail;
