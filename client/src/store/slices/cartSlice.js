import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const s = localStorage.getItem("leafinity_cart");
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem("leafinity_cart", JSON.stringify(items));
  } catch (_) {}
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadCart() },
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, price, quantity = 1, image } = action.payload;
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) existing.quantity += quantity;
      else state.items.push({ productId, name, price, quantity, image: image || null });
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveCart(state.items);
    },
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) state.items = state.items.filter((i) => i.productId !== productId);
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
