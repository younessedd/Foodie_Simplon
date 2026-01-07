import { configureStore } from "@reduxjs/toolkit";
import restaurantsReducer from "./restaurantsSlice";
import cartReducer from "./cartSlice";

// Configure the Redux store with multiple slices
export const store = configureStore({
  reducer: {
    restaurants: restaurantsReducer, // Restaurants slice
    cart: cartReducer,               // Cart slice
  },
});

export default store;
