/******************************************************************************
 * File: notApi.ts
 * Layer: core
 * Desc: Legacy API re-exports for backward compatibility - use feature-specific APIs instead
 ******************************************************************************/

/**
 * @deprecated - This file provides re-exports for transition to feature-based API usage.
 * Do not use directly. Instead, use features/catalogue/api.ts or features/account/api.ts.
 */

// Selective exports from each module to prevent naming conflicts
// Value exports
export {
  // Products API
  catalogAdapter,
  productsApi,
  catalogSelectors,
  selectCatalogue,
  selectProductsByQuery,
  useGetCatalogueQuery,
} from '../../features/catalogue/api';

// Type exports
export type {
  Item,
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  CatalogState,
  UseGetCatalogueQueryResult,
} from '../../features/catalogue/api';

// Value exports
export {
  // Account API
  historyAdapter,
  accountApi,
  historySelectors,
  selectHistory,
  selectHistoryItems,
  selectVisibleHistoryItems,
  selectRemainingHistoryCount,
  useGetHistoryQuery,
  useGetEmptyHistoryQuery,
  addPurchaseToHistory,
} from '../../features/account/api';

// Type exports
export type {
  Purchase,
  HistoryState,
  UseGetHistoryQueryResult,
  UseGetEmptyHistoryQueryResult,
} from '../../features/account/api';

// API combination - used in store.ts
import { productsApi } from '../../features/catalogue/api';
import { accountApi } from '../../features/account/api';

/**
 * Legacy notApi export for backward compatibility
 * Combines products and account APIs under single namespace
 * @deprecated Use individual feature APIs instead
 */
export const notApi = {
  ...productsApi,
  reducerPath: 'notApi',
  endpoints: {
    ...productsApi.endpoints,
    ...accountApi.endpoints,
  },
  // Middleware and reducers taken directly from new APIs
  middleware: productsApi.middleware,
  reducer: productsApi.reducer,
  util: productsApi.util,
};
