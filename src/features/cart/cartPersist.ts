import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import cartReducer from './cartSlice';

// Redux-persist ile cartReducer'ı sarmala
// Bu sayede tarayıcı yenilense bile sepet verileri korunur
export default persistReducer(
  { 
    key: 'cart', 
    storage, 
    whitelist: ['entities', 'ids'] // Sadece entities ve ids bilgilerini sakla
  },
  cartReducer
); 