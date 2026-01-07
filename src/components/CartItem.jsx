import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart, decrementItem, removeFromCart } from "../redux/cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch(); // Get Redux dispatch function

  const handleIncreaseQuantity = () => {
    dispatch(addToCart(item));
    toast.success(`Quantité de ${item.name} augmentée!`, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="cartItem">
      {/* Display product image */}
      <img src={item.image} alt={item.name} />

      <div className="cartItem__info">
        {/* Display product name */}
        <h4>{item.name}</h4>

        {/* Display product price per item */}
        <p className="muted">${item.price} / item</p>

        {/* Quantity controls */}
        <div className="qty">
          {/* Decrease quantity button */}
          <button onClick={() => dispatch(decrementItem(item.id))}>-</button>
          
          {/* Show current quantity */}
          <span>{item.quantity}</span>
          
          {/* Increase quantity button */}
          <button onClick={handleIncreaseQuantity}>+</button>
        </div>
      </div>

      <div className="cartItem__total">
        {/* Show total price for this item */}
        ${(item.price * item.quantity).toFixed(2)}

        {/* Remove item from cart */}
        <button className="btn btn--danger" onClick={() => dispatch(removeFromCart(item.id))}>
          Clear Item
        </button>
      </div>
    </div>
  );
};

export default CartItem;
