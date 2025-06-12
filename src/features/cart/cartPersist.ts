/******************************************************************************
 * File: cartPersist.ts
 * Layer: feature
 * Desc: Redux persist configuration for cart state persistence across browser sessions
 ******************************************************************************/

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import cartReducer from './cartSlice';

/**
 * Wrap cartReducer with Redux-persist
 * This ensures cart data is preserved even when browser is refreshed
 */
export default persistReducer(
  {
    key: 'cart',
    storage,
    whitelist: ['entities', 'ids'], // Only persist entities and ids information
  },
  cartReducer
);
