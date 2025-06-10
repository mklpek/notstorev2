import { createSelector } from '@reduxjs/toolkit';
import { cartAdapter } from './cartSlice';
import type { RootState } from '../../core/store';
import type { CartItem } from './types';

// Adapter selectors - Tek kaynak burasıdır
export const {
  selectAll: selectCartItems,
  selectById: selectCartItemById,
  selectTotal: selectCartItemCount, // kaç tür ürün var (farklı ID'ler)
} = cartAdapter.getSelectors<RootState>((state: RootState) => state.cart);

// Hesaplanan selektörler - memoized
export const selectCartTotal = createSelector(selectCartItems, (items: CartItem[]) =>
  items.reduce((total: number, item: CartItem) => total + item.price * item.qty, 0)
);

// Toplam ürün adedi
export const selectCartCount = createSelector(selectCartItems, (items: CartItem[]) =>
  items.reduce((count: number, item: CartItem) => count + item.qty, 0)
);

// Belirli bir ürünün sepette olup olmadığını kontrol eden selektör
export const selectIsInCart = (productId: number) =>
  createSelector(selectCartItems, (items: CartItem[]) =>
    items.some((item: CartItem) => item.id === productId)
  );
