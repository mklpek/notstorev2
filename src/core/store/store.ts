/******************************************************************************
 * File: store.ts
 * Layer: core
 * Desc: Redux store setup with RTK Query, Redux Persist, and middleware configuration
 ******************************************************************************/

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { productsApi } from '../../features/catalogue/api';
import { accountApi } from '../../features/account/api';
import cartReducer from '../../features/cart/cartSlice';
import themeReducer from '../../features/theme/themeSlice';
import userReducer from '../../features/account/userSlice';
// import historyReducer from '../../features/history/historySlice'; // TODO: Implement history feature

/**
 * Cart persistence configuration
 * Uses whitelist to persist only specific fields for future-proofing
 * New fields added later won't be automatically persisted
 */
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['entities', 'ids'], // Only persist EntityAdapter data
};

/**
 * Theme persistence configuration
 * Persists user's theme preference across sessions
 */
const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['mode'], // Only persist theme mode preference
};

/**
 * Root reducer combining all feature reducers
 * Includes RTK Query API slices and persisted reducers
 */
const rootReducer = combineReducers({
  [productsApi.reducerPath]: productsApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  theme: persistReducer(themePersistConfig, themeReducer),
  user: userReducer, // Telegram user data - NOT persisted for security
});

/**
 * Root persistence configuration
 * Blacklists API slices and user data to prevent persistence
 */
const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: [productsApi.reducerPath, accountApi.reducerPath, 'user'], // Don't persist APIs and user data
};

// Apply persistence to the root reducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

/**
 * Configure Redux store with middleware and dev tools
 * Includes RTK Query middleware and Redux Persist serialization handling
 */
export const store = configureStore({
  reducer: persistedReducer,
  // Customize serialization checks for Redux Persist
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Redux Persist actions for serialization checks
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }).concat(productsApi.middleware, accountApi.middleware),
  devTools: import.meta.env.DEV,
});

/**
 * Create persistor for Redux Persist
 * Handles rehydration of persisted state on app startup
 */
export const persistor = persistStore(store);

/* TypeScript type helpers for store */
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
