/******************************************************************************
 * File: cartSlice.ts
 * Layer: feature
 * Desc: Normalized cart state management with reducers and selectors
 ******************************************************************************/

import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
  type EntityState,
} from '@reduxjs/toolkit';
import type { CartItem } from './types';
import type { RootState } from '../../core/store';

/**
 * Entity adapter for normalized cart state management
 * Provides CRUD operations for cart items with automatic ID handling
 */
export const cartAdapter = createEntityAdapter<CartItem>();

/**
 * Cart state type definition using EntityAdapter
 * Provides normalized state structure with ids array and entities object
 */
export type CartState = EntityState<CartItem, number>;

/**
 * Cart slice managing shopping cart state
 * Uses EntityAdapter for normalized state structure and efficient updates
 */
const slice = createSlice({
  name: 'cart',
  initialState: cartAdapter.getInitialState(),
  reducers: {
    /**
     * Add item to cart or increment quantity if exists
     * @param state - Current cart state
     * @param payload - Item data without quantity (defaults to 1)
     */
    addItem: (state, { payload }: PayloadAction<Omit<CartItem, 'qty'>>) => {
      const existing = state.entities[payload.id];
      if (existing && typeof existing.qty === 'number') {
        // Increment quantity for existing item
        existing.qty += 1;
      } else {
        // Add new item with quantity 1
        cartAdapter.addOne(state, { ...payload, qty: 1 });
      }
    },

    /**
     * Remove item completely from cart
     * @param state - Current cart state
     * @param payload - Item ID to remove
     */
    removeItem: (state, { payload }: PayloadAction<number>) => {
      cartAdapter.removeOne(state, payload);
    },

    /**
     * Change item quantity by delta (increment/decrement)
     * Removes item if quantity would become 0 or negative
     * @param state - Current cart state
     * @param payload - Object with item ID and delta change (+1 or -1)
     */
    changeQty: (state, { payload }: PayloadAction<{ id: number; delta: 1 | -1 }>) => {
      const item = state.entities[payload.id];
      if (!item || typeof item.qty !== 'number') return;

      if (item.qty + payload.delta <= 0) {
        // Remove item if quantity would be 0 or negative
        cartAdapter.removeOne(state, payload.id);
      } else {
        // Update quantity
        item.qty += payload.delta;
      }
    },

    /**
     * Clear all items from cart
     * @param state - Current cart state
     */
    clearCart: state => cartAdapter.removeAll(state),
  },
});

export const { addItem, removeItem, changeQty, clearCart } = slice.actions;
export default slice.reducer;
