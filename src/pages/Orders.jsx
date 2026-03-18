import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Package, Clock, CheckCircle, X, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useOrderStore from '../store/orderStore';

const ITEMS_PER_PAGE = 3;

const OrderCard = ({ order, onDelete, onUpdate }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [tempItems, setTempItems] = useState(order.items);

  const statusColors = {
    confirmed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    preparing: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    delivered: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const statusIcons = {
    confirmed: <CheckCircle className="w-4 h-4" />,
    preparing: <Clock className="w-4 h-4" />,
    delivered: <Package className="w-4 h-4" />,
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = tempItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setTempItems(updatedItems);
    setHasChanges(true);
  };

  const handleConfirmUpdate = () => {
    onUpdate(order.id, tempItems);
    setHasChanges(false);
  };

  const handleCancelUpdate = () => {
    setTempItems(order.items);
    setHasChanges(false);
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              Order #{order.id.slice(-8)}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
            {statusIcons[order.status]}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {tempItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Minus className="w-3 h-3 text-gray-600 dark:text-white" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-700 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Plus className="w-3 h-3 text-gray-600 dark:text-white" />
                  </button>
                </div>
              </div>
              <p className="font-bold text-orange-500">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {hasChanges && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
              You have unsaved changes
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmUpdate}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Confirm Update
              </button>
              <button
                onClick={handleCancelUpdate}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            Total: <span className="text-orange-500">${calculateTotal(tempItems).toFixed(2)}</span>
          </p>
          <button
            onClick={() => onDelete(order.id)}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Orders = () => {
  const { orders, removeOrder, updateOrderItems } = useOrderStore();
  const [showNotification, setShowNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (orderId) => {
    removeOrder(orderId);
  };

  const handleUpdate = (orderId, updatedItems) => {
    updateOrderItems(orderId, updatedItems);
  };

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Notification */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">Order placed successfully!</span>
            <button onClick={() => setShowNotification(false)}>
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Your Orders</h1>
          <p className="text-white/90">Track and manage your orders</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No orders yet</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onDelete={handleDelete} 
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
