import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { ApiResponse } from '../products/api';

/** -----------  Ortak Tip Tanımlamaları  ----------- */
export interface Purchase {
  timestamp: number; // Unix zaman damgası, benzersiz ID olarak kullanılır
  id: number; // ürün ID'si
  total: number;
  currency: string; // 'NOT'
}

/** ----------- History EntityAdapter ----------- */
// History için özel EntityAdapter
export const historyAdapter = createEntityAdapter<Purchase>({
  // sortComparer ile sıralama yap
  sortComparer: (a, b) => b.timestamp - a.timestamp,
});

// History state tipi - rawPurchases kaldırıldı
export type HistoryState = ReturnType<typeof historyAdapter.getInitialState>;

/** -----------  Account API Dilimi  ----------- */
export const accountApi = createApi({
  reducerPath: 'accountApi', // store'daki anahtar
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://not-contest-cdn.openbuilders.xyz/api/',
  }),
  tagTypes: ['History'],
  endpoints: builder => ({
    /** GET /history.json  →  Purchase[] (kullanıcının sipariş geçmişi varsa) */
    getHistory: builder.query<HistoryState, void>({
      query: () => 'history.json',
      transformResponse: (response: unknown) => {
        // Type guard ile tip kontrolü
        const typedResponse = response as ApiResponse<Purchase[]>;

        // Hata kontrolü - ok: false ise hata fırlat
        if (!typedResponse.ok) {
          throw new Error(typedResponse.error.message || 'API Hatası');
        }

        const purchases = typedResponse.data;
        // Normalize edilmiş veriyi EntityAdapter ile hazırla - setAll kullanarak
        const normalized = historyAdapter.setAll(historyAdapter.getInitialState(), purchases);
        return normalized; // rawPurchases artık yok
      },
      providesTags: ['History'],
    }),

    /** GET /no_history.json  →  [] (boş durum için varyant) */
    getEmptyHistory: builder.query<HistoryState, void>({
      query: () => 'no_history.json',
      transformResponse: (response: unknown) => {
        // Type guard ile tip kontrolü
        const typedResponse = response as ApiResponse<Purchase[]>;

        // Hata kontrolü - ok: false ise hata fırlat
        if (!typedResponse.ok) {
          throw new Error(typedResponse.error.message || 'API Hatası');
        }

        const purchases = typedResponse.data;
        // Normalize edilmiş veriyi EntityAdapter ile hazırla - setAll kullanarak
        const normalized = historyAdapter.setAll(historyAdapter.getInitialState(), purchases);
        return normalized; // rawPurchases artık yok
      },
      providesTags: ['History'],
    }),
  }),
});

/* History için selektörler - entityAdapter ile hazırlanmış */
export const historySelectors = historyAdapter.getSelectors();

/* Store'dan history seçici */
export const selectHistory = (state: RootState) =>
  state[accountApi.reducerPath]?.queries?.getHistory?.data as HistoryState | undefined;

// Hook tiplerini burada tanımlayarak, import hatalarının önüne geçiyoruz
export type UseGetHistoryQueryResult = ReturnType<typeof accountApi.endpoints.getHistory.useQuery>;
export type UseGetEmptyHistoryQueryResult = ReturnType<
  typeof accountApi.endpoints.getEmptyHistory.useQuery
>;

/* History için yardımcı selektörler - EntityAdapter kullanarak */
export const selectHistoryItems = (result: UseGetHistoryQueryResult): Purchase[] => {
  // Veri yoksa boş dizi döndür
  if (!result.data) return [];

  // EntityAdapter ile sorgu sonucundan geçmişi çek
  return historySelectors.selectAll(result.data);
};

/* Görünür geçmiş öğelerini seçmek için yardımcı fonksiyon */
export const selectVisibleHistoryItems = (
  result: UseGetHistoryQueryResult,
  visibleCount: number
): Purchase[] => {
  const allItems = selectHistoryItems(result);
  return allItems.slice(0, visibleCount);
};

/* Kalan geçmiş öğe sayısını hesaplamak için yardımcı fonksiyon */
export const selectRemainingHistoryCount = (
  result: UseGetHistoryQueryResult,
  visibleCount: number
): number => {
  const allItems = selectHistoryItems(result);
  return Math.max(0, allItems.length - visibleCount);
};

/* React bileşenleri için otomatik oluşturulan hook'lar */
export const {
  useGetHistoryQuery,
  useGetEmptyHistoryQuery,
  util: { getRunningQueriesThunk },
} = accountApi;

/* API Utils - Cache Manipülasyon Fonksiyonları */
/**
 * History cache'ine yeni bir satın alma ekler
 * Bu fonksiyon, upsertQueryData kullanarak RTK Query cache'ini
 * direkt olarak manipüle eder, bu da herhangi bir slice'a gerek kalmadan
 * veri ekleme imkanı sağlar.
 */
export const addPurchaseToHistory = (dispatch: any, purchase: Purchase) => {
  // Cache'den mevcut history verisini al
  const historyQueryArg = undefined; // void argüman
  dispatch(
    accountApi.util.updateQueryData('getHistory', historyQueryArg, draft => {
      // Adapter yardımıyla yeni satın almayı ekle
      historyAdapter.addOne(draft, purchase);
    })
  );
};
