import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../components/CartItem";
import { clearCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";

const CartPage = () => {
  const items = useSelector((s) => s.cart.items); // Get cart items from Redux
  const dispatch = useDispatch(); // Get Redux dispatch function
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Calculate total price of all items in cart
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    // Here you would normally send the order to your backend
    console.log('Order submitted:', { items, total, customer: formData });
    setOrderSubmitted(true);
    setTimeout(() => {
      setShowCheckoutModal(false);
      setOrderSubmitted(false);
      dispatch(clearCart());
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: ''
      });
    }, 2000);
  };

  return (
    <div className="container section cart-page">
      {/* Page header with title and link back to shopping */}
      <div className="pageHeader">
        <h2>Shopping Cart</h2>
        <Link to="/" className="btn btn--light">← Continue Shopping</Link>
      </div>

      {/* If cart is empty, show a message */}
      {items.length === 0 ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <>
          {/* List of cart items */}
          <div className="cartList">
            {items.map((i) => (
              <CartItem key={i.id} item={i} />
            ))}
          </div>

          {/* Cart summary section */}
          <div className="cartSummary">
            <div className="summaryRow">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <div className="summaryButtons">
              {/* Clear cart button on the left */}
              <button className="btn btn--danger-outline" onClick={() => dispatch(clearCart())}>
                Clear Cart
              </button>

              {/* Checkout button on the right */}
              <button className="btn btn--success-outline" onClick={() => setShowCheckoutModal(true)}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Checkout Form</h3>
              <button className="modal-close" onClick={() => setShowCheckoutModal(false)}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {orderSubmitted ? (
                <div className="success-message">
                  <h4>Commande Send Successful!</h4>
                  <p>Your order has been placed successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrder}>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>City:</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  
                                    
                  <button type="submit" className="btn btn--success-outline" style={{ display: 'block', margin: '20px auto 0' }}>
                    Check Out
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
