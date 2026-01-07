import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] }, // Initial state: empty cart
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        // If item exists, increase quantity by 1
        exists.quantity += 1;
      } else {
        // If item does not exist, add it with quantity 1
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    // Decrease quantity of an item
    decrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity -= 1; // Decrease quantity
        if (item.quantity <= 0) {
          // Remove item if quantity reaches 0
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },

    // Remove item completely from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    // Clear all items from cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Export actions for use in components
export const { addToCart, decrementItem, removeFromCart, clearCart } =
  cartSlice.actions;

// Export reducer for store configuration
export default cartSlice.reducer;
