import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Star, Plus, Minus, ShoppingCart, DollarSign } from 'lucide-react';
import { fetchRestaurants, fetchRestaurantMenu, fetchCategories } from '../services/api';
import { useCartStore } from '../store/cartStore';

const MenuItem = ({ item, index, addItem }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem({
      id: item.idMeal || item.id,
      name: item.strMeal || item.name,
      price: item.price,
      image: item.strMealThumb || item.image,
      quantity,
    });
    setQuantity(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex">
        <img
          src={item.strMealThumb || item.image}
          alt={item.strMeal || item.name}
          className="w-28 h-28 object-cover"
        />
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-1">
            {item.strMeal || item.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
            {item.description || `Delicious ${item.strMeal || item.name}`}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-orange-500">${item.price}</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!item.isAvailable}
                className="px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-full text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addItem, toggleCart } = useCartStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const restaurants = await fetchRestaurants();
        const rest = restaurants.find(r => r.id === id);
        setRestaurant(rest || restaurants[0]);

        const [menuData, cats] = await Promise.all([
          fetchRestaurantMenu(id),
          fetchCategories(),
        ]);
        setMenu(menuData);
        setCategories([{ strCategory: 'All' }, ...cats]);
      } catch (err) {
        console.error('Error loading restaurant:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleAddToCart = (item) => {
    addItem(item);
    toggleCart();
  };

  const filteredMenu = selectedCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg mb-4">Restaurant not found</p>
        <Link to="/restaurants" className="text-orange-500 hover:underline">Go back to restaurants</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <Link
          to="/restaurants"
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      {/* Restaurant Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {restaurant.name}
              </h1>
              <p className="text-orange-500 font-medium mb-3">{restaurant.cuisine}</p>
              <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  {restaurant.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  {restaurant.deliveryTime}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  {restaurant.address}
                </span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${restaurant.isOpen ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
              {restaurant.isOpen ? 'Open Now' : 'Closed'}
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Menu</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.slice(0, 1).map((cat) => (
              <button
                key={cat.strCategory}
                onClick={() => setSelectedCategory(cat.strCategory)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-medium transition-all ${
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

        {/* Menu Items */}
        <div className="mt-6 space-y-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-28 h-28 bg-gray-300 dark:bg-gray-700 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredMenu.length > 0 ? (
            filteredMenu.map((item, index) => (
              <MenuItem 
                key={item.idMeal || item.id} 
                item={item} 
                index={index} 
                addItem={handleAddToCart}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No items in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
