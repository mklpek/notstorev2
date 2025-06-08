import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { productsApi } from '../features/products/api';
import { accountApi } from '../features/account/api';
import cartReducer from '../features/cart/cartSlice';
import themeReducer from '../features/theme/themeSlice';
// import historyReducer from '../features/history/historySlice'; // Yorum satırı yapıldı

// Cart state'ini local storage'da kalıcı tutmak için persist konfigürasyonu
// Whitelist kullanarak sadece istediğimiz alanları persist ediyoruz
// Böylece gelecekte eklenen yeni alanlar otomatik olarak persist edilmez
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['entities', 'ids'], // Sadece adapter verilerini persist et
};

// Theme persist konfigürasyonu
const themePersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['mode'], // Sadece mod tercihini persist et
};

// Tüm reducerları birleştir
const rootReducer = combineReducers({
  [productsApi.reducerPath]: productsApi.reducer,
  [accountApi.reducerPath]: accountApi.reducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  theme: persistReducer(themePersistConfig, themeReducer),
});

// Root persist config - API'leri blacklist'e ekle
const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: [productsApi.reducerPath, accountApi.reducerPath], // API'leri persist etme
};

// Birleştirilmiş reducerı persist et
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // Redux persist için serileştirme kontrollerini özelleştir
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux persist işlemleri için serileştirme kontrolünü devre dışı bırak
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }).concat(productsApi.middleware, accountApi.middleware),
  devTools: import.meta.env.DEV,
});

// Persistor oluştur
export const persistor = persistStore(store);

/* Single-store typing helpers */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
