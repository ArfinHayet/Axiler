// store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CartItemArray } from '@/app/products/models/CartItem';

interface CartState {
  data: CartItemArray | null;
}

const initialState: CartState = {
  data: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartData(state, action: PayloadAction<CartItemArray>) {
      state.data = action.payload;
    },
    updateCartData(state, action: PayloadAction<Partial<CartItemArray>>) {
      if (state.data) {
        // Example: replace items at matching indices, otherwise keep original
        state.data = state.data.map((item, idx) =>
          action.payload[idx] !== undefined ? action.payload[idx]! : item
        );
      }
    },
    clearCartData(state) {
      state.data = null;
    },
  },
});

export const { setCartData, updateCartData, clearCartData } = cartSlice.actions;
export default cartSlice.reducer;
