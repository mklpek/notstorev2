/**
 * @deprecated - Bu dosya feature-bazlı API kullanımına geçiş için
 * yeniden dışa aktarma sağlar. Doğrudan kullanmayın.
 * Bunun yerine, features/products/api.ts veya features/account/api.ts kullanın.
 */

// Her modülden seçici export yaparak çakışmaları önlüyoruz
// Value exports
export { 
  // Products API
  catalogAdapter, productsApi, catalogSelectors, 
  selectCatalogue, selectProductsByQuery, useGetCatalogueQuery
} from '../features/products/api';

// Type exports 
export type { 
  Item, ApiResponse, ApiSuccessResponse, ApiErrorResponse,
  CatalogState, UseGetCatalogueQueryResult
} from '../features/products/api';

// Value exports
export {
  // Account API
  historyAdapter, accountApi, historySelectors, 
  selectHistory, selectHistoryItems, selectVisibleHistoryItems, 
  selectRemainingHistoryCount, useGetHistoryQuery, 
  useGetEmptyHistoryQuery, addPurchaseToHistory
} from '../features/account/api';

// Type exports
export type {
  Purchase, HistoryState, UseGetHistoryQueryResult,
  UseGetEmptyHistoryQueryResult
} from '../features/account/api';

// API birleştirme - store.ts'de kullanılır
import { productsApi } from '../features/products/api';
import { accountApi } from '../features/account/api';

// notApi adı altında dışa aktarıyoruz (uyumluluk için)
export const notApi = {
  ...productsApi,
  reducerPath: 'notApi',
  endpoints: {
    ...productsApi.endpoints,
    ...accountApi.endpoints,
  },
  // Middleware ve reducer'ları doğrudan yeni API'lardan alıyoruz
  middleware: productsApi.middleware,
  reducer: productsApi.reducer,
  util: productsApi.util,
}; 