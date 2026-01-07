import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../redux/cartSlice";

const MenuItem = ({ item }) => {
  const dispatch = useDispatch(); // Get Redux dispatch function

  const handleAddToCart = () => {
    dispatch(addToCart(item));
    toast.success(`${item.name} ajouté au panier!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="card menu">
      {/* Image of the menu item */}
      <div className="card__image">
        <img src={item.image} alt={item.name} />
      </div>

      {/* Menu item details */}
      <div className="card__body">
        {/* Name of the menu item */}
        <h4>{item.name}</h4>

        {/* Row with price and add button */}
        <div className="menu__row">
          {/* Price of the item */}
          <span className="price">${item.price}</span>

          {/* Add to cart button */}
          <button className="btn btn--primary" onClick={handleAddToCart}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
