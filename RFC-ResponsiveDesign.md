# RFC: Telegram Mini App Responsive Tasarım Implementasyonu

## Özet

Bu RFC, "Not Store" Telegram Mini App'in 6 farklı tarayıcı/platform üzerinde düzgün çalışmasını ve responsive tasarım prensiplerine uygun olmasını sağlamak için yapılması gereken değişiklikleri ve eklemeleri detaylandırmaktadır.

## Motivasyon

Mevcut yapı, temelde mobil odaklı (390px container genişliği) olarak tasarlanmıştır. Ancak, uygulamanın Telegram Mini App dışında da kullanılması ve farklı ekran boyutlarında (tablet, dizüstü bilgisayar, masaüstü) düzgün görüntülenmesi gerekmektedir. Bu RFC, bu ihtiyacı karşılamak için atılması gereken adımları tanımlamaktadır.

## Mevcut Durum Analizi

Mevcut projede CSS Modules kullanılmaktadır. Responsive tasarım için Tailwind CSS gibi bir framework kullanılmamaktadır. Uygulamanın ana yapısı şu şekildedir:

1. **MainLayout**: TabBar, Header ve ana içeriği içeren temel düzen
2. **ProductGrid**: 2 sütunlu grid yapısı (12px gap)
3. **ItemPage**: Tam ekran ürün detay sayfası
4. **CartModal**: Sepet modalı
5. **SearchBar**: Arama çubuğu
6. **AccountPage**: Profil sayfası

Şu anda belirli bir responsive stratejisi bulunmamaktadır ve container genişliği 390px olarak sabitlenmiştir.

## Çözüm Önerisi

### 1. Global CSS Değişiklikleri

```css
/* src/styles/theme.css dosyasına eklenecek */

/* Responsive breakpoints */
:root {
  --breakpoint-sm: 640px;  /* Küçük mobil cihazlar */
  --breakpoint-md: 768px;  /* Tablet ve geniş mobil */
  --breakpoint-lg: 1024px; /* Dizüstü ve küçük masaüstü */
  --breakpoint-xl: 1280px; /* Masaüstü */
  --container-padding: 16px; /* Sayfa kenar boşlukları */
}

/* Container sınıfı için responsive genişlikler */
.container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* Responsive medya sorguları */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}

/* Orientation değişimlerini ele almak için */
@media (orientation: landscape) {
  .app-container {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
  }
}
```

### 2. MainLayout Komponenti Güncellemesi

```tsx
// src/layouts/MainLayout.module.css
.mainLayout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.content {
  flex: 1;
  width: 100%;
}

@media (min-width: 768px) {
  .mainLayout {
    flex-direction: row;
  }
  
  .sidebar {
    width: 260px;
    height: 100vh;
    position: sticky;
    top: 0;
  }
  
  .content {
    flex: 1;
    padding-left: 16px;
  }
}

// src/layouts/MainLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { TabBar } from '../components/TabBar';
import styles from './MainLayout.module.css';
import { useEffect, useState } from 'react';

interface MainLayoutProps {
  onCartClick: () => void;
}

export const MainLayout = ({ onCartClick }: MainLayoutProps) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.mainLayout}>
      {!isMobile && (
        <div className={styles.sidebar}>
          <TabBar />
        </div>
      )}
      
      <div className={styles.content}>
        <Header onCartClick={onCartClick} />
        <main className="container">
          <Outlet />
        </main>
        {isMobile && <TabBar />}
      </div>
    </div>
  );
};
```

### 3. ProductGrid Komponenti Güncellemesi

```css
/* src/features/products/components/ProductGrid.module.css */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px 0;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1280px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
  }
}

/* Yatay modu için özel ayarlamalar */
@media (orientation: landscape) and (max-height: 600px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 4. ItemPage Komponenti Güncellemesi

```css
/* src/features/products/components/ItemPage.module.css */
.itemPage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.imageContainer {
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
}

.infoContainer {
  padding: 16px;
}

@media (min-width: 768px) {
  .itemPage {
    flex-direction: row;
    align-items: flex-start;
    gap: 32px;
    padding: 32px 16px;
  }
  
  .imageContainer {
    width: 50%;
    position: sticky;
    top: 32px;
  }
  
  .infoContainer {
    width: 50%;
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .imageContainer {
    width: 60%;
  }
  
  .infoContainer {
    width: 40%;
  }
}

/* Yatay mod düzenlemesi */
@media (orientation: landscape) and (max-height: 600px) {
  .itemPage {
    flex-direction: row;
    gap: 16px;
    height: auto;
    padding: 16px;
  }
  
  .imageContainer {
    width: 50%;
  }
  
  .infoContainer {
    width: 50%;
  }
}
```

### 5. CartModal Komponenti Güncellemesi

```css
/* src/features/cart/CartModal.module.css */
.modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 320px;
  background-color: var(--tg-theme-bg-color);
  border-radius: 12px 12px 0 0;
  z-index: 1000;
}

@media (min-width: 768px) {
  .modal {
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 400px;
    height: 400px;
    border-radius: 12px;
  }
}

@media (min-width: 1024px) {
  .modal {
    width: 480px;
  }
}

/* Yatay mod düzenlemesi */
@media (orientation: landscape) and (max-height: 600px) {
  .modal {
    height: 80vh;
    bottom: 10vh;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    border-radius: 12px;
  }
}
```

### 6. SearchBar Komponenti Güncellemesi

```css
/* src/features/search/SearchBar.module.css */
.searchOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  padding: 16px;
}

.searchInput {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: var(--tg-theme-secondary-bg-color);
  color: var(--tg-theme-text-color);
}

@media (min-width: 768px) {
  .searchOverlay {
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    border-radius: 12px;
  }
}

@media (min-width: 1024px) {
  .searchOverlay {
    width: 600px;
  }
}

/* Yatay mod düzenlemesi */
@media (orientation: landscape) and (max-height: 600px) {
  .searchOverlay {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    border-radius: 12px;
  }
}
```

### 7. TabBar Komponenti Güncellemesi

```css
/* src/components/TabBar/TabBar.module.css */
.tabBar {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--tg-theme-bg-color);
  height: 60px;
  z-index: 100;
  border-top: 1px solid var(--tg-theme-hint-color);
}

@media (min-width: 768px) {
  .tabBar {
    position: static;
    flex-direction: column;
    height: auto;
    padding: 32px 0;
    border-top: none;
    border-right: 1px solid var(--tg-theme-hint-color);
  }
  
  .tabItem {
    margin-bottom: 16px;
  }
}

/* Yatay mod düzenlemesi */
@media (orientation: landscape) and (max-height: 600px) {
  .tabBar {
    height: 48px;
  }
}
```

### 8. AccountPage Komponenti Güncellemesi

```css
/* src/features/account/AccountPage.module.css */
.accountPage {
  padding: 16px;
}

.profileHeader {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 16px;
}

@media (min-width: 768px) {
  .accountPage {
    padding: 32px;
  }
  
  .profileHeader {
    margin-bottom: 32px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
}

/* Collections grid */
.collectionsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .collectionsGrid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .collectionsGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Yatay mod düzenlemesi */
@media (orientation: landscape) and (max-height: 600px) {
  .accountPage {
    padding: 16px;
  }
  
  .profileHeader {
    margin-bottom: 16px;
  }
  
  .collectionsGrid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}
```

### 9. Responsive Test Utility Oluşturulması

```typescript
// src/utils/responsive.ts
export enum Breakpoint {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280
}

export enum Orientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = windowSize.width < Breakpoint.MD;
  const isTablet = windowSize.width >= Breakpoint.MD && windowSize.width < Breakpoint.LG;
  const isDesktop = windowSize.width >= Breakpoint.LG;
  const isLandscape = windowSize.width > windowSize.height;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLandscape,
    windowSize
  };
};
```

### 10. App.tsx Güncellemesi

```typescript
// src/App.tsx
import { useEffect, lazy, Suspense, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AppSkeleton } from './components/Skeleton';
import { CartModal } from './features/cart/CartModal';
import { SearchBar } from './features/search/SearchBar';
import './styles/theme.css';

const ProductGrid = lazy(() => import('./features/products/ProductGrid'));
const ItemPage = lazy(() => import('./features/products/components/ItemPage'));
const AccountPage = lazy(() => import('./features/account/AccountPage'));

function App() {
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [orientation, setOrientation] = useState(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
  
  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleCartClick = () => setShowCart(true);
  const handleCartClose = () => setShowCart(false);
  const handleSearchClick = () => setShowSearch(true);
  const handleSearchClose = () => setShowSearch(false);

  return (
    <div className={`app-container ${orientation}`}>
      <Suspense fallback={<AppSkeleton />}>
        <Routes>
          <Route path="product/:productId" element={<ItemPage />} />
          <Route 
            element={
              <MainLayout 
                onCartClick={handleCartClick} 
                onSearchClick={handleSearchClick} 
              />
            }
          >
            <Route index element={<ProductGrid />} />
            <Route path="profile" element={<AccountPage />} />
          </Route>
        </Routes>
      </Suspense>
      
      {showCart && <CartModal onClose={handleCartClose} />}
      {showSearch && <SearchBar onClose={handleSearchClose} />}
    </div>
  );
}

export default App;
```

### 11. Header Komponenti Güncellemesi

```css
/* src/components/Header/Header.module.css */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--tg-theme-bg-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.title {
  font-size: 26px;
  font-weight: 590;
  font-family: 'SF Pro Rounded', sans-serif;
}

.iconContainer {
  display: flex;
  gap: 16px;
}

@media (min-width: 768px) {
  .header {
    padding: 24px 32px;
  }
  
  .title {
    font-size: 30px;
  }
}

@media (orientation: landscape) and (max-height: 600px) {
  .header {
    padding: 12px 16px;
  }
  
  .title {
    font-size: 22px;
  }
}
```

## Uygulama Planı

Responsive tasarım implementasyonu için aşağıdaki adımları izleyeceğiz:

### Adım 1: Global CSS Değişikliklerinin Yapılması
- `theme.css` dosyasına responsive breakpoint'lerin ve container sınıfının eklenmesi
- Orientation değişimleri için media query'lerin eklenmesi

### Adım 2: Responsive Utility Hook'unun Oluşturulması
- `useResponsive` hook'unun `src/hooks` klasörüne eklenmesi
- Temel breakpoint ve orientation detection fonksiyonlarının implementasyonu

### Adım 3: Ana Layout Yapısının Güncellenmesi
- `MainLayout` komponentinin tablet ve masaüstü için sidebar yapısına dönüştürülmesi
- Mobil cihazlarda bottom TabBar, tablet/masaüstünde sidebar TabBar gösterimi

### Adım 4: Component Bazlı Responsive CSS Güncellemeleri
- ProductGrid: Ekran boyutuna göre grid sütun sayısının ayarlanması
- ItemPage: Tablet ve masaüstünde yan yana layout'a geçiş
- CartModal ve SearchBar: Farklı ekran boyutları için konum ve boyut ayarlamaları
- TabBar: Mobil ve tablet/masaüstü için farklı layout'lar
- AccountPage: Responsive koleksiyon grid'i

### Adım 5: Orientation Değişimleri için Özel Düzenlemeler
- Landscape modunda mobil cihazlar için özel CSS düzenlemeleri
- Yükseklik sınırlı cihazlar için içerik optimizasyonu

### Adım 6: Test ve Uyumluluk Kontrolleri
- 6 farklı tarayıcıda test (Chrome, Firefox, Safari, Edge, Opera, Telegram WebView)
- Farklı ekran boyutlarında ve oryantasyonlarda test
- Telegram Mini App'e özel gereksinimler için ek kontroller

## Tarayıcı/Platform Uyumluluk Matrisi

| Platform/Tarayıcı    | Mobil (320-639px) | Tablet (640-1023px) | Masaüstü (1024px+) | Landscape Modu | Portrait Modu |
|----------------------|-------------------|---------------------|---------------------|----------------|---------------|
| Chrome (Android)     | ✓                 | ✓                   | ✓                   | ✓              | ✓             |
| Safari (iOS)         | ✓                 | ✓                   | ✓                   | ✓              | ✓             |
| Firefox Mobile       | ✓                 | ✓                   | ✓                   | ✓              | ✓             |
| Chrome (Desktop)     | ✓                 | ✓                   | ✓                   | N/A            | N/A           |
| Firefox (Desktop)    | ✓                 | ✓                   | ✓                   | N/A            | N/A           |
| Telegram WebView     | ✓                 | ✓                   | ✓                   | ✓              | ✓             |

## Kontrol Listesi

### Mobil Tarayıcı Kontrolleri
- [ ] Chrome Android - Mobil genişlikte kontrol
- [ ] Chrome Android - Landscape modunda kontrol
- [ ] Safari iOS - Mobil genişlikte kontrol
- [ ] Safari iOS - Landscape modunda kontrol
- [ ] Firefox Mobile - Mobil genişlikte kontrol
- [ ] Firefox Mobile - Landscape modunda kontrol
- [ ] Telegram WebView - Mobil genişlikte kontrol
- [ ] Telegram WebView - Landscape modunda kontrol

### Tablet Kontrolleri
- [ ] iPad (Safari) - Portrait modunda kontrol
- [ ] iPad (Safari) - Landscape modunda kontrol
- [ ] Android Tablet (Chrome) - Portrait modunda kontrol
- [ ] Android Tablet (Chrome) - Landscape modunda kontrol
- [ ] Telegram WebView (Tablet) - Genel kontrol

### Masaüstü Tarayıcı Kontrolleri
- [ ] Chrome - 1024px genişlikte kontrol
- [ ] Chrome - 1280px genişlikte kontrol
- [ ] Firefox - 1024px genişlikte kontrol
- [ ] Firefox - 1280px genişlikte kontrol
- [ ] Safari - 1024px genişlikte kontrol
- [ ] Safari - 1280px genişlikte kontrol
- [ ] Edge - 1024px genişlikte kontrol
- [ ] Edge - 1280px genişlikte kontrol

### Responsive Özellik Kontrolleri
- [ ] Grid sisteminin farklı ekran boyutlarında uyumluluğu
- [ ] Yazı boyutlarının farklı ekranlarda okunabilirliği
- [ ] Butonların ve tıklanabilir alanların dokunmatik ekranlarda kullanılabilirliği
- [ ] Scroll davranışlarının incelenmesi
- [ ] Modal ve Overlay bileşenlerinin farklı boyutlardaki görünümleri
- [ ] Tablet/masaüstü optimizasyonlarının kontrolü
- [ ] Landscape mod optimizasyonlarının kontrolü

## Sonuç

Bu RFC, "Not Store" Telegram Mini App'in 6 farklı tarayıcı/platform üzerinde düzgün çalışmasını ve responsive tasarım prensiplerine uygun olmasını sağlamak için detaylı bir yol haritası sunmaktadır. Önerilen değişiklikler, uygulamanın hem mobil cihazlarda hem de tablet ve masaüstü platformlarda kullanıcı dostu bir deneyim sunmasını sağlayacaktır.

Ayrıca, yatay (landscape) ve dikey (portrait) mod geçişlerinde bozulma olmadan ekrana göre yeniden düzenleme yapan bir yapı oluşturulacaktır. Bu sayede, kullanıcılar hangi cihaz veya ekran yönelimi ile erişirse erişsin, tutarlı ve kullanışlı bir arayüzle karşılaşacaktır. 