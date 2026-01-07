import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRestaurants } from "../api/api";

// Async thunk to fetch restaurants from API
export const getRestaurants = createAsyncThunk(
  "restaurants/getAll",
  async () => {
    return await fetchRestaurants(); // Call the API and return the data
  }
);

const restaurantsSlice = createSlice({
  name: "restaurants",
  // Initial state: empty data, not loading, no error
  initialState: { data: [], loading: false, error: null },
  reducers: {}, // No regular reducers needed here
  extraReducers: (builder) => {
    builder
      // Pending state: loading starts
      .addCase(getRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled state: API returned data successfully
      .addCase(getRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      // Rejected state: API call failed
      .addCase(getRestaurants.rejected, (state, action) => {
        state.loading = false;
        // If there is an error message, use it; otherwise, fallback
        state.error = action.error.message || "An error occurred while loading restaurants";
      });
  },
});

// Export reducer to configure store
export default restaurantsSlice.reducer;
