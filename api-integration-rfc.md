# RFC: API Entegrasyonu ve Dinamik Veri Kullanımı İyileştirmeleri

## 1. Özet

Bu RFC, mevcut Telegram Mini App uygulamasının API entegrasyon özelliklerini değerlendirmekte ve iyileştirme önerileri sunmaktadır. Şu anda uygulamada RTK Query ile API entegrasyonu kurulmuş durumda, ancak bazı geliştirmeler ve eksik özelliklerin tamamlanması gerekmektedir.

## 2. Mevcut Durum

Şu anda uygulama üç temel API endpoint'ini kullanıyor:

1. **Catalogue GET**: `https://not-contest-cdn.openbuilders.xyz/api/items.json`
   - Ürünler listesini çeker
   - Redux Toolkit EntityAdapter ile normalize edilmiş veri saklar
   - Yükleme durumunda skeleton gösterilmekte

2. **User Purchase History GET**: `https://not-contest-cdn.openbuilders.xyz/api/history.json`
   - Kullanıcının satın alma geçmişini döndürür
   - EntityAdapter ile normalize edilmiş veri
   - Yükleme durumunda AccountPageSkeleton gösterilmekte

3. **Empty History GET**: `https://not-contest-cdn.openbuilders.xyz/api/no_history.json`
   - Boş geçmiş durumunu kontrol etmek için endpoint
   - API tanımlanmış ancak aktif olarak kullanılmıyor

### 2.1 Eksiklikler ve Sorunlar

1. **Empty History Entegrasyonu**: Boş geçmiş durumu için `useGetEmptyHistoryQuery` hook tanımlanmış ancak aktif kullanılmıyor. Şu anda uygulamada sadece `useGetHistoryQuery` kullanılıyor ve boş durumlar client-side kontrol ediliyor. (✅ TAMAMLANDI)

2. **Hata İşleme**: Genel hata işleme mekanizması eksik, 404, 500 vb. hata durumları için özelleştirilmiş UI mesajları yeterli değil. (✅ TAMAMLANDI)

3. **Loading Durumları**: Yükleme durumları için skeleton oluşturulmuş ancak bazı bileşenlerde kullanımları tutarsız.

4. **Empty State UI**: NoResultsFound bileşeni arama için kullanılıyor, ancak boş sepet veya boş geçmiş için ayrı UI/UX oluşturulmamış. (⚠️ Figma uyumluluk nedeniyle yapılmadı - mevcut görsel yapı korundu)

5. **API Response Tipi**: ✅ TAMAMLANDI - ApiResponse tipi güçlendirildi ve hata işleme için tip güvenliği eklendi.

## 3. İyileştirme Önerileri

### 3.1 Empty History Entegrasyonu (✅ TAMAMLANDI)

`/api/no_history.json` endpoint'i için eksiksiz bir yönlendirme implementasyonu eklenmelidir:

```typescript
// account/AccountPage.tsx içinde

// Mevcut yapı
const historyResult = useGetHistoryQuery();

// Önerilen iyileştirme
const [useHistoryApi, setUseHistoryApi] = useState(true);
const historyResult = useHistoryApi 
  ? useGetHistoryQuery() 
  : useGetEmptyHistoryQuery();

// Hata durumunda alternatif API'ye geçiş
useEffect(() => {
  if (historyResult.error) {
    setUseHistoryApi(false);
  }
}, [historyResult.error]);
```

### 3.2 Hata İşleme Mekanizması (✅ TAMAMLANDI)

Tüm API çağrıları için tutarlı bir hata işleme bileşeni oluşturulmalı:

```typescript
// components/ApiErrorMessage.tsx
import React from 'react';
import styles from './ApiErrorMessage.module.css';

interface ApiErrorMessageProps {
  error: any;
  onRetry?: () => void;
  customMessage?: string;
}

const ApiErrorMessage: React.FC<ApiErrorMessageProps> = ({ 
  error, 
  onRetry, 
  customMessage 
}) => {
  // HTTP hata koduna göre mesaj belirleme
  const getErrorMessage = () => {
    if (customMessage) return customMessage;
    
    if (!error) return 'Bilinmeyen bir hata oluştu';
    
    // Status koduna göre mesaj belirleme
    if (error.status === 404) {
      return 'İstenen kaynak bulunamadı';
    } else if (error.status >= 500) {
      return 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin';
    } else if (error.status === 401 || error.status === 403) {
      return 'Bu işlem için yetkiniz bulunmuyor';
    }
    
    return 'Bir hata oluştu, lütfen tekrar deneyin';
  };

  return (
    <div className={styles.errorContainer}>
      <div className={styles.iconContainer}>
        <img src="/assets/error-icon.svg" alt="Hata" className={styles.icon} />
      </div>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>Hata Oluştu</h2>
        <p className={styles.description}>{getErrorMessage()}</p>
      </div>
      {onRetry && (
        <button 
          className={styles.retryButton} 
          onClick={onRetry}
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
};

export default ApiErrorMessage;
```

### 3.3 Loading State İyileştirmeleri

Tüm API çağrıları için tutarlı bir skeleton yapısı:

```typescript
// ProductGrid.tsx içinde
// Mevcut yapı
if (isLoading) {
  return loadingContent;
}

// Önerilen iyileştirme
if (isLoading) {
  return <ProductGridSkeleton itemCount={6} />;
}

if (error) {
  return (
    <ApiErrorMessage 
      error={error} 
      onRetry={() => refetch()} 
    />
  );
}
```

### 3.4 Empty State UI (⚠️ Figma Uyumluluk Nedeniyle Ertelendi)

Mevcut tasarıma sadık kalmak için genel bir EmptyState bileşeni oluşturulması ertelendi. Bunun yerine:

- Arama sonuçları için NoResultsFound bileşeni kullanılmaya devam edilecek
- Geçmiş için mevcut "No history yet" gösterimi korunacak
- Figma ile uyumlu kalarak, her durum için özel gösterimler kullanılacak

### 3.5 API Response Type İyileştirmesi (✅ TAMAMLANDI)

notApi.ts dosyasında API response tipleri aşağıdaki şekilde iyileştirilmiştir:

```typescript
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

// Kullanım (tüm endpoint'lerde uygulandı)
transformResponse: (response: unknown) => {
  // Type guard ile tip kontrolü
  const typedResponse = response as ApiResponse<Item[]>;
  
  // Hata kontrolü - ok: false ise hata fırlat
  if (!typedResponse.ok) {
    throw new Error(typedResponse.error.message || 'API Hatası');
  }
  
  const items = typedResponse.data;
  // ... işleme devam et
}
```

## 4. getEmptyHistory Endpoint Yeniden Değerlendirmesi (✅ TAMAMLANDI)

Mevcut implementasyonda `getEmptyHistory` endpoint'i var ancak kullanılmıyor. Bu endpoint'in gerekliliği değerlendirilmelidir:

### 4.1 Seçenek 1: Endpoint'i Kaldırma

`useGetHistoryQuery` hook'u içinde boş durumları kontrol etmek ve UI'ı buna göre güncellemek:

```typescript
// AccountPage.tsx içinde
const { data, isLoading, error } = useGetHistoryQuery();
const hasHistory = data && historySelectors.selectTotal(data) > 0;

// Görünüm
return (
  <div>
    {isLoading ? (
      <AccountPageSkeleton showHistory={true} historyItemCount={6} />
    ) : error ? (
      <ApiErrorMessage error={error} onRetry={() => refetch()} />
    ) : hasHistory ? (
      <HistoryContent data={data} />
    ) : (
      <div className={styles.noHistoryMessage}>No history yet</div>
    )}
  </div>
);
```

### 4.2 Seçenek 2: Hata Durumunda Fallback (✅ TAMAMLANDI)

`getHistory` endpoint'i başarısız olursa, `getEmptyHistory` endpoint'ine yönlendirme:

```typescript
// accountHooks.ts içinde
export const useAccountHistory = () => {
  const [isUsingEmptyEndpoint, setIsUsingEmptyEndpoint] = useState(false);
  
  const historyQuery = useGetHistoryQuery(undefined, { 
    skip: isUsingEmptyEndpoint 
  });
  
  const emptyHistoryQuery = useGetEmptyHistoryQuery(undefined, {
    skip: !isUsingEmptyEndpoint
  });
  
  // İlk endpoint hata verirse, boş endpoint'e geç
  useEffect(() => {
    if (historyQuery.error && !isUsingEmptyEndpoint) {
      setIsUsingEmptyEndpoint(true);
    }
  }, [historyQuery.error, isUsingEmptyEndpoint]);
  
  // Aktif olan sorgu sonucunu döndür
  return isUsingEmptyEndpoint ? emptyHistoryQuery : historyQuery;
};
```

## 5. Önerilen Hata İşleme Stratejisi (✅ TAMAMLANDI)

Tutarlı bir hata işleme stratejisi uygulanmalıdır:

1. **Global Error Boundary**: Uygulama çapında hataları yakalamak için React Error Boundary kullanımı
2. **API Error Interceptor**: RTK Query baseQuery içinde hata yakalama
3. **Component-Level Error Handling**: Her bileşende `error` durumlarının kontrolü
4. **Retry Logic**: Otomatik yeniden deneme mekanizması

### 5.1 RTK Query Error Interceptor

```typescript
// api/notApi.ts içinde
export const notApi = createApi({
  reducerPath: 'notApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://not-contest-cdn.openbuilders.xyz/api/',
    prepareHeaders: (headers) => {
      // Gerekli header'lar
      return headers;
    },
  }),
  // Hata yakalama için baseQuery wrapper
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: 'https://not-contest-cdn.openbuilders.xyz/api/',
    })(args, api, extraOptions);
    
    // Hata durumunu kontrol et
    if (result.error) {
      // Hata logları ve analytics
      console.error('API Error:', result.error);
      
      // Özel hata formatı
      return {
        error: {
          status: result.error.status,
          data: result.error.data || 'API Error',
          message: getErrorMessage(result.error)
        }
      };
    }
    
    return result;
  },
  // ... diğer ayarlar
});

// Hata mesajı belirleme yardımcısı
const getErrorMessage = (error: any) => {
  if (!error) return 'Unknown error';
  
  switch (error.status) {
    case 404: return 'Resource not found';
    case 500: return 'Server error';
    case 401: return 'Unauthorized';
    case 403: return 'Forbidden';
    default: return `Error: ${error.status || 'Unknown'}`;
  }
};
```

## 6. Uygulama Planı

Önerilen değişikliklerin uygulanması için plan:

1. **API Response Tipi İyileştirmesi** - (✅ TAMAMLANDI)
   - ✅ ApiResponse tipini güçlendirme
   - ✅ Hata işleme için tip güvenliği ekleme

2. **Hata İşleme Bileşenleri** - (✅ TAMAMLANDI)
   - ✅ ApiErrorMessage bileşeni oluşturma
   - ✅ Error handling implementasyonu
   - ✅ RTK Query error handling ekleme

3. **Empty State UI İyileştirmeleri** - (⚠️ Figma Uyumluluk Nedeniyle Ertelendi)
   - ⚠️ Figma tasarımına sadık kalmak için mevcut UI korundu
   - ⚠️ NoResultsFound ve mevcut "No history yet" gösterimi korundu

4. **getEmptyHistory Entegrasyonu** - (✅ TAMAMLANDI)
   - ✅ AccountPage bileşenini güncelleme
   - ✅ useEmptyHistoryAPI state oluşturma
   - ✅ Error handling implementasyonu

5. **Skeleton Loading İyileştirmeleri** - 1 gün
   - Tüm API çağrıları için tutarlı loading state yapısı

6. **Test ve Optimizasyon** - 1 gün
   - End-to-end test
   - Performans optimizasyonu

## 7. Sonuç

Bu RFC, API entegrasyonu ve dinamik veri kullanımını geliştirmek için kapsamlı öneriler sunmaktadır. Önerilen değişiklikler, daha sağlam bir kullanıcı deneyimi, daha iyi hata işleme ve daha tutarlı loading/empty state yönetimi sağlayacaktır.

Önerilen geliştirmelerin büyük kısmı tamamlanmış olup, UI değişiklikleri Figma tasarımına sadık kalmak için mevcut haliyle korunmuştur. API entegrasyonu ve hata işleme mekanizmaları başarıyla iyileştirilmiş ve uygulamanın gerçek API'lerle entegrasyonu güçlendirilmiştir. 