import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, UtensilsCrossed, Store, ChevronDown, MapPin, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCartStore } from '../store/cartStore';
import { fetchCategories, getAllCuisines } from '../services/api';

const Navbar = () => {
  const { isDark, setIsDark } = useTheme();
  const { getTotalItems, toggleCart } = useCartStore();
  const [categories, setCategories] = useState([]);
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showRestaurantMenu, setShowRestaurantMenu] = useState(false);
  const foodMenuRef = useRef(null);
  const restaurantMenuRef = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (foodMenuRef.current && !foodMenuRef.current.contains(event.target)) {
        setShowFoodMenu(false);
      }
      if (restaurantMenuRef.current && !restaurantMenuRef.current.contains(event.target)) {
        setShowRestaurantMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cuisines = getAllCuisines();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Foodie
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {/* Food Categories Dropdown */}
            <div className="relative" ref={foodMenuRef}>
              <button
                onClick={() => { setShowFoodMenu(!showFoodMenu); setShowRestaurantMenu(false); }}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Food Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${showFoodMenu ? 'rotate-180' : ''}`} />
              </button>
              {showFoodMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 max-h-80 overflow-y-auto">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.name}`}
                      onClick={() => setShowFoodMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/restaurants"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Store className="w-4 h-4" />
              All Restaurants
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            <button
              onClick={toggleCart}
              className="relative p-2 rounded-xl bg-orange-500 hover:bg-orange-600 transition-all"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
