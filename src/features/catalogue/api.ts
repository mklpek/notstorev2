/******************************************************************************
 * File: api.ts
 * Layer: feature
 * Desc: Catalogue API endpoints with RTK Query and EntityAdapter for product management
 ******************************************************************************/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '../../core/store';

/** ----------- Common Type Definitions ----------- */
export interface Item {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string; // always 'NOT'
  left: number; // stock quantity
  tags: { fabric: string };
  images: string[];
}

/**
 * Small helper — all API data comes wrapped in { ok, data } format
 * Improved API response types for better error handling
 */
export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    code: number;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** ----------- Catalog EntityAdapter ----------- */
/**
 * Entity adapter for normalized catalog state management
 * Provides automatic sorting and CRUD operations for items
 */
export const catalogAdapter = createEntityAdapter<Item>({
  // Add sortComparer for adapter - this way we can maintain sorting without rawItems
  sortComparer: (a, b) => a.id - b.id,
});

/**
 * Catalog state type definition - rawItems removed for cleaner state
 */
export type CatalogState = ReturnType<typeof catalogAdapter.getInitialState>;

/** ----------- Products API Slice ----------- */
/**
 * RTK Query API slice for product catalogue management
 * Handles data fetching, caching, and normalization
 */
export const productsApi = createApi({
  reducerPath: 'productsApi', // key in store
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://not-contest-cdn.openbuilders.xyz/api/',
  }),
  tagTypes: ['Catalogue'],
  endpoints: builder => ({
    /**
     * GET /items.json → Item[]
     * Fetches product catalogue and normalizes data using EntityAdapter
     */
    getCatalogue: builder.query<CatalogState, void>({
      query: () => 'items.json',
      transformResponse: (response: unknown) => {
        // Type guard for type checking
        const typedResponse = response as ApiResponse<Item[]>;

        // Error check - throw error if ok: false
        if (!typedResponse.ok) {
          throw new Error(typedResponse.error.message || 'API Error');
        }

        const items = typedResponse.data;
        // Prepare normalized data with EntityAdapter - using setAll
        const normalized = catalogAdapter.setAll(catalogAdapter.getInitialState(), items);
        return normalized; // rawItems no longer exists
      },
      providesTags: ['Catalogue'],
    }),
  }),
});

/**
 * Catalog selectors prepared with entityAdapter
 * Provides selectAll, selectById, selectIds, etc.
 */
export const catalogSelectors = catalogAdapter.getSelectors();

/**
 * Selector for catalog from store
 * @param state - Root state
 * @returns Catalog state or undefined
 */
export const selectCatalogue = (state: RootState) =>
  state[productsApi.reducerPath]?.queries?.getCatalogue?.data as CatalogState | undefined;

/**
 * Type definition for useGetCatalogueQuery hook result
 * Defined here to prevent import errors
 */
export type UseGetCatalogueQueryResult = ReturnType<
  typeof productsApi.endpoints.getCatalogue.useQuery
>;

/**
 * Helper function for search - using EntityAdapter
 * Filters products based on search query across category and name
 * @param result - Query result from useGetCatalogueQuery
 * @param query - Search query string
 * @returns Filtered array of items
 */
export const selectProductsByQuery = (
  result: UseGetCatalogueQueryResult,
  query: string
): Item[] => {
  // Return empty array if no data
  if (!result.data) return [];

  // Get all products through entity adapter
  const allProducts = catalogSelectors.selectAll(result.data);

  // Return all if no search query
  if (!query) return allProducts;

  // Filter if search query exists
  return allProducts.filter((p: Item) =>
    `${p.category} ${p.name}`.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Auto-generated hooks for React components
 * Provides useGetCatalogueQuery and utility functions
 */
export const {
  useGetCatalogueQuery,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = productsApi;
