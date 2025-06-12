/******************************************************************************
 * File: selectors.ts
 * Layer: feature
 * Desc: Cart selectors using EntityAdapter for optimized cart state access
 ******************************************************************************/

import { createSelector } from '@reduxjs/toolkit';
import { cartAdapter } from './cartSlice';
import type { RootState } from '../../core/store';
import type { CartItem } from './types';

/**
 * Adapter selectors - Single source of truth
 * Provides optimized access to cart items using EntityAdapter
 */
export const {
  selectAll: selectCartItems,
  selectById: selectCartItemById,
  selectTotal: selectCartItemCount, // how many different products (different IDs)
} = cartAdapter.getSelectors<RootState>((state: RootState) => state.cart);

/**
 * Calculated selectors - memoized
 * Computes total cart value from all items
 */
export const selectCartTotal = createSelector(selectCartItems, (items: CartItem[]) =>
  items.reduce((total: number, item: CartItem) => total + item.price * item.qty, 0)
);

/**
 * Total product quantity selector
 * Calculates total number of items in cart (sum of all quantities)
 */
export const selectCartCount = createSelector(selectCartItems, (items: CartItem[]) =>
  items.reduce((count: number, item: CartItem) => count + item.qty, 0)
);

/**
 * Selector to check if a specific product is in cart
 * @param productId - Product ID to check
 * @returns Selector function that returns boolean
 */
export const selectIsInCart = (productId: number) =>
  createSelector(selectCartItems, (items: CartItem[]) =>
    items.some((item: CartItem) => item.id === productId)
  );
