import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '../../core/store';

/** -----------  Ortak Tip Tanımlamaları  ----------- */
export interface Item {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string; // her zaman 'NOT'
  left: number; // stok
  tags: { fabric: string };
  images: string[];
}

/** Küçük yardımcı — tüm API verileri { ok, data } şeklinde sarılı gelir */
// İyileştirilmiş API response tipleri
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
export const catalogAdapter = createEntityAdapter<Item>({
  // Adapter için sortComparer ekliyoruz - bu sayede sıralamayı rawItems olmadan koruyabiliriz
  sortComparer: (a, b) => a.id - b.id,
});

// Catalog tipini tanımla - rawItems kaldırıldı
export type CatalogState = ReturnType<typeof catalogAdapter.getInitialState>;

/** -----------  Products API Dilimi  ----------- */
export const productsApi = createApi({
  reducerPath: 'productsApi', // store'daki anahtar
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://not-contest-cdn.openbuilders.xyz/api/',
  }),
  tagTypes: ['Catalogue'],
  endpoints: builder => ({
    /** GET /items.json  →  Item[] */
    getCatalogue: builder.query<CatalogState, void>({
      query: () => 'items.json',
      transformResponse: (response: unknown) => {
        // Type guard ile tip kontrolü
        const typedResponse = response as ApiResponse<Item[]>;

        // Hata kontrolü - ok: false ise hata fırlat
        if (!typedResponse.ok) {
          throw new Error(typedResponse.error.message || 'API Hatası');
        }

        const items = typedResponse.data;
        // Normalize edilmiş veriyi EntityAdapter ile hazırla - setAll kullanarak
        const normalized = catalogAdapter.setAll(catalogAdapter.getInitialState(), items);
        return normalized; // rawItems artık yok
      },
      providesTags: ['Catalogue'],
    }),
  }),
});

/* Catalog için selektörler - entityAdapter ile hazırlanmış */
export const catalogSelectors = catalogAdapter.getSelectors();

/* Store'dan catalog seçici */
export const selectCatalogue = (state: RootState) =>
  state[productsApi.reducerPath]?.queries?.getCatalogue?.data as CatalogState | undefined;

// useGetCatalogueQuery hook tipini burada tanımlayarak, import hatalarının önüne geçiyoruz
export type UseGetCatalogueQueryResult = ReturnType<
  typeof productsApi.endpoints.getCatalogue.useQuery
>;

/* Arama için yardımcı fonksiyon - EntityAdapter kullanarak */
export const selectProductsByQuery = (
  result: UseGetCatalogueQueryResult,
  query: string
): Item[] => {
  // Veri yoksa boş dizi döndür
  if (!result.data) return [];

  // Tüm ürünleri entity adapter üzerinden al
  const allProducts = catalogSelectors.selectAll(result.data);

  // Arama yoksa tümünü döndür
  if (!query) return allProducts;

  // Arama varsa filtrele
  return allProducts.filter((p: Item) =>
    `${p.category} ${p.name}`.toLowerCase().includes(query.toLowerCase())
  );
};

/* React bileşenleri için otomatik oluşturulan hook'lar */
export const {
  useGetCatalogueQuery,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = productsApi;
