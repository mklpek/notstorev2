/******************************************************************************
 * File: api.ts
 * Layer: feature
 * Desc: Account API with purchase history management using EntityAdapter
 ******************************************************************************/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '../../core/store';
import type { ApiResponse } from '../catalogue/api';

/** -----------  Common Type Definitions  ----------- */
export interface Purchase {
  timestamp: number; // Unix timestamp, used as unique ID
  id: number; // product ID
  total: number;
  currency: string; // 'NOT'
}

/** ----------- History EntityAdapter ----------- */
/**
 * Special EntityAdapter for history
 * Provides normalized state management for purchase history
 */
export const historyAdapter = createEntityAdapter<Purchase>({
  // Sort with sortComparer
  sortComparer: (a, b) => b.timestamp - a.timestamp,
});

/**
 * History state type - rawPurchases removed
 */
export type HistoryState = ReturnType<typeof historyAdapter.getInitialState>;

/** -----------  Account API Slice  ----------- */
export const accountApi = createApi({
  reducerPath: 'accountApi', // key in store
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://not-contest-cdn.openbuilders.xyz/api/',
  }),
  tagTypes: ['History'],
  endpoints: builder => ({
    /** GET /history.json  →  Purchase[] (if user has order history) */
    getHistory: builder.query<HistoryState, void>({
      query: () => 'history.json',
      transformResponse: (response: unknown) => {
        // Type guard for type checking
        const typedResponse = response as ApiResponse<Purchase[]>;

        // Error check - throw error if ok: false
        if (!typedResponse.ok) {
          throw new Error(typedResponse.error.message || 'API Error');
        }

        const purchases = typedResponse.data;
        // Prepare normalized data with EntityAdapter - using setAll
        const normalized = historyAdapter.setAll(historyAdapter.getInitialState(), purchases);
        return normalized; // rawPurchases no longer exists
      },
      providesTags: ['History'],
    }),

    /** GET /no_history.json  →  [] (variant for empty state) */
    getEmptyHistory: builder.query<HistoryState, void>({
      query: () => 'no_history.json',
      transformResponse: (response: unknown) => {
        // Type guard for type checking
        const typedResponse = response as ApiResponse<Purchase[]>;

        // Error check - throw error if ok: false
        if (!typedResponse.ok) {
          throw new Error(typedResponse.error.message || 'API Error');
        }

        const purchases = typedResponse.data;
        // Prepare normalized data with EntityAdapter - using setAll
        const normalized = historyAdapter.setAll(historyAdapter.getInitialState(), purchases);
        return normalized; // rawPurchases no longer exists
      },
      providesTags: ['History'],
    }),
  }),
});

/**
 * Selectors for history - prepared with entityAdapter
 */
export const historySelectors = historyAdapter.getSelectors();

/**
 * History selector from store
 */
export const selectHistory = (state: RootState) =>
  state[accountApi.reducerPath]?.queries?.getHistory?.data as HistoryState | undefined;

/**
 * Hook types defined here to prevent import errors
 */
export type UseGetHistoryQueryResult = ReturnType<typeof accountApi.endpoints.getHistory.useQuery>;
export type UseGetEmptyHistoryQueryResult = ReturnType<
  typeof accountApi.endpoints.getEmptyHistory.useQuery
>;

/**
 * Helper selectors for history - using EntityAdapter
 */
export const selectHistoryItems = (result: UseGetHistoryQueryResult): Purchase[] => {
  // Return empty array if no data
  if (!result.data) return [];

  // Get history from query result with EntityAdapter
  return historySelectors.selectAll(result.data);
};

/**
 * Helper function to select visible history items
 * @param result - History query result
 * @param visibleCount - Number of items to show
 * @returns Array of visible purchase items
 */
export const selectVisibleHistoryItems = (
  result: UseGetHistoryQueryResult,
  visibleCount: number
): Purchase[] => {
  const allItems = selectHistoryItems(result);
  return allItems.slice(0, visibleCount);
};

/**
 * Helper function to calculate remaining history item count
 * @param result - History query result
 * @param visibleCount - Number of currently visible items
 * @returns Number of remaining items
 */
export const selectRemainingHistoryCount = (
  result: UseGetHistoryQueryResult,
  visibleCount: number
): number => {
  const allItems = selectHistoryItems(result);
  return Math.max(0, allItems.length - visibleCount);
};

/**
 * Auto-generated hooks for React components
 */
export const {
  useGetHistoryQuery,
  useGetEmptyHistoryQuery,
  util: { getRunningQueriesThunk },
} = accountApi;

/** API Utils - Cache Manipulation Functions */
/**
 * Adds a new purchase to history cache
 * This function uses upsertQueryData to directly manipulate RTK Query cache,
 * allowing data addition without needing any slice.
 * @param dispatch - Redux dispatch function
 * @param purchase - Purchase object to add to history
 */
export const addPurchaseToHistory = (dispatch: any, purchase: Purchase) => {
  // Get existing history data from cache
  const historyQueryArg = undefined; // void argument
  dispatch(
    accountApi.util.updateQueryData('getHistory', historyQueryArg, draft => {
      // Add new purchase with adapter helper
      historyAdapter.addOne(draft, purchase);
    })
  );
};
