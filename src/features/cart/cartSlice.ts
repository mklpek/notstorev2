import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
  type EntityState,
} from '@reduxjs/toolkit';
import type { CartItem } from './types';
import type { RootState } from '../../core/store';

// EntityAdapter oluştur ve export et - selectId parametresiz
export const cartAdapter = createEntityAdapter<CartItem>();

// Tip tanımı - generic parametreleri doğru şekilde belirtildi
export type CartState = EntityState<CartItem, number>;

const slice = createSlice({
  name: 'cart',
  initialState: cartAdapter.getInitialState(),
  reducers: {
    addItem: (state, { payload }: PayloadAction<Omit<CartItem, 'qty'>>) => {
      const existing = state.entities[payload.id];
      if (existing && typeof existing.qty === 'number') {
        existing.qty += 1;
      } else {
        cartAdapter.addOne(state, { ...payload, qty: 1 });
      }
    },
    removeItem: (state, { payload }: PayloadAction<number>) => {
      cartAdapter.removeOne(state, payload);
    },
    changeQty: (state, { payload }: PayloadAction<{ id: number; delta: 1 | -1 }>) => {
      const item = state.entities[payload.id];
      if (!item || typeof item.qty !== 'number') return;

      if (item.qty + payload.delta <= 0) {
        cartAdapter.removeOne(state, payload.id);
      } else {
        item.qty += payload.delta;
      }
    },
    clearCart: state => cartAdapter.removeAll(state),
  },
});

export const { addItem, removeItem, changeQty, clearCart } = slice.actions;
export default slice.reducer;
