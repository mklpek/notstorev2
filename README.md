# Not Store - Telegram Mini App

[Figma tasarımına](https://www.figma.com/design/CNyDh8dajidImm7mGiM0yL/Untitled?node-id=1-7892&t=c4ro1yHNezpapz6M-4) birebir uygun olarak geliştirilmiş modern bir Telegram Mini App e-ticaret uygulaması.

## 🚀 Özellikler

- **Figma Birebir Uyumluluk**: Tasarımdan direkt indirilen görseller ve ikonlar
- **Tam Ürün Detay Sayfası**: ItemPage ile detaylı ürün görüntüleme
- **Gelişmiş Navigasyon**: React Router DOM ile modern routing (✅ Aktif)
- **Redux Toolkit**: Modern state management (✅ Aktif)
- **RTK Query**: API data fetching ve caching (✅ Aktif)
- **Redux Persist**: State persistence (✅ Tamamlandı)
- **Tam Sepet Sistemi**: Cart slice ve UI (✅ Tamamlandı)
- **Modal Sistemi**: Cart modal ve genel modal bileşeni (✅ Aktif)
- **Search Functionality**: Arama çubuğu özelliği (✅ Aktif)
- **History Feature**: Sipariş geçmişi yönetimi (✅ API entegrasyonu tamamlandı)
- **API Error Handling**: Gelişmiş hata yönetimi (✅ Aktif)
- **Empty State Components**: Boş durum bileşenleri (✅ Aktif)
- **Progressive Image Loading**: Görsel yükleme optimizasyonu (✅ Aktif)
- **Custom Hooks**: useDebounce ve useSkeletonTheme hooks (✅ Aktif)
- **Skeleton Loading**: React Loading Skeleton ile loading states (✅ Tamamlandı)
- **Lazy Loading**: Code splitting ve performance optimizasyonu (✅ Tamamlandı)
- **Virtualization**: React Window ile performans optimizasyonu (✅ Tamamlandı)
- **TON Connect Integration**: Blockchain cüzdan bağlantısı ve ödeme sistemi (✅ Tamamlandı)
- **CSP Optimization**: Content Security Policy optimizasyonu ve Vercel uyumluluğu (✅ Aktif)
- **ESLint Compliance**: TypeScript strict mode ve lint kuralları uyumluluğu (✅ Aktif)
- **API Proxy System**: GitHub raw içeriği için proxy endpoint'leri (✅ Aktif)
- **Responsive Layout System**: Telegram WebView uyumlu responsive tasarım (✅ Tamamlandı)
- **CSS Modules Architecture**: Tek global theme + modüler bileşen stilleri
- **Clean Project Structure**: Tutarlı isimlendirme ve optimize edilmiş klasör yapısı
- **Telegram WebApp 2.0 Integration**: Bot API 8+ paradigması ile modern entegrasyon (✅ Tamamlandı)
- **Safe Area Support**: iOS/Android home indicator ve gesture bar desteği (✅ Tamamlandı)
- **Version-Aware API Calls**: Telegram sürüm kontrolü ile güvenli API kullanımı (✅ Tamamlandı)
- **Dynamic Viewport Management**: Klavye ve sistem çubuğu değişikliklerini takip (✅ Tamamlandı)
- **Transparent Header**: Şeffaf sistem başlığı ile modern görünüm (✅ Tamamlandı)
- **Responsive Tasarım**: 320px-430px arası tüm cihazlarda uyumlu
- **Modüler Mimari**: Temiz ve sürdürülebilir kod yapısı
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi
- **Git Hooks**: Husky ile pre-commit ve commit-msg kontrolü
- **Code Quality**: ESLint, Prettier ve lint-staged entegrasyonu
- **Custom Font Integration**: SF Pro Rounded font ailesi (✅ Aktif)
- **BlurHash Integration**: Görsel yükleme için blur placeholder (✅ Aktif)
- **React Swipeable**: Touch gesture desteği (✅ Aktif)
- **Intersection Observer**: Performans optimizasyonu için görünürlük kontrolü (✅ Aktif)

## 📱 Tasarım ve Sayfalar

Uygulama [Figma tasarımından](https://www.figma.com/design/CNyDh8dajidImm7mGiM0yL/Untitled?node-id=1-7892&t=c4ro1yHNezpapz6M-4) birebir kopyalanmıştır:

### 🏪 Store Sayfası (Ana Sayfa)

- **Header**: "Not Store" başlığı (SF Pro, 26px, 590 weight)
- **Arama İkonu**: Figma'dan indirilen SVG (28x28px) - Search bar açar
- **Sepet İkonu**: Figma'dan indirilen SVG (28x28px) - Cart modal açar
- **Ürün Grid'i**: 2 sütunlu responsive grid (12px gap)
- **6 Ürün Kartı**: 390px container genişliği
- **Pagination Dots**: Resim galerisi ile

### 🛍️ Ürün Detay Sayfası (ItemPage)

- **Tam Ekran Layout**: Header ve TabBar gizli
- **Ürün Başlığı**: "t-shirt boxlogo" (dinamik)
- **Paylaş Butonu**: ShareIcon ile sosyal paylaşım
- **Ürün Açıklaması**: "Volumetric silk screen printing PUFF..."
- **Etiketler**: Fiyat (1000 $NOT), Stok (42 LEFT), Malzeme (100% COTTON)
- **Büyük Ürün Görseli**: Ana ürün resmi
- **Ürün Galerisi**: 5 farklı ürün görünümü slider
- **Footer**: Alt navigasyon

### 👤 Profil Sayfası (AccountPage)

- **Profil Avatar**: Kullanıcı resmi (profile-avatar.png)
- **Kullanıcı Adı**: "Alex"
- **Koleksiyonlar**: Emoji placeholder ile

### 🧭 Navigasyon (React Router DOM) - ✅ GÜNCEL

- **Route-based Navigation**: Modern client-side routing
- **Nested Routes**: MainLayout ile TabBar/Header yönetimi
- **Dynamic Routes**: `/product/:productId` ile ürün detayları
- **Protected Routes**: Layout tabanlı route koruma

### 🛒 Sepet Sistemi (✅ Tamamlandı)

- **Redux Cart Slice**: EntityAdapter ile normalleştirilmiş state
- **Cart Modal**: Figma uyumlu sepet arayüzü
- **Quantity Management**: Artırma/azaltma butonları
- **Cart Selectors**: Memoized selector'lar
- **✅ Redux Persist**: Aktif ve çalışıyor (cartPersist.ts ile konfigüre edilmiş)

### 🔍 Search Bar (Aktif)

- **Fixed Positioning**: Üstte sabit kalma
- **Blur Background**: Arka plan bulanıklığı
- **Auto Focus**: Otomatik odaklanma
- **Keyboard Support**: Enter/Escape tuş desteği
- **Debounce Hook**: useDebounce ile performans optimizasyonu

### 🛒 Cart Modal (Aktif)

- **Figma Uyumlu**: Exact tasarım uygulaması
- **Blur Backdrop**: rgba(0,0,0,0.7) + blur(8px)
- **320px Height**: Sabit modal yüksekliği
- **Close Button**: SVG ile kapatma butonu

### 💰 TON Connect Integration (✅ Tamamlandı)

- **Blockchain Wallet Connection**: TON blockchain cüzdan bağlantısı
- **Buy Now Functionality**: Ürün detay sayfasında "Buy Now" butonu ile direkt ödeme
- **Multiple Wallet Support**: Tonkeeper, OpenMask, MyTonWallet ve diğer TON cüzdanları
- **Transaction Management**: Güvenli blockchain transaction yönetimi
- **Success Modal**: İşlem başarılı olduğunda gösterilen modal
- **Modal Blur Effect**: Sepet modalı ile aynı blur efekti (rgba(0,0,0,0.7) + blur(8px))
- **Light Theme**: Beyaz tema kullanımı
- **Error Handling**: Bağlantı ve transaction hata yönetimi
- **Provider Pattern**: React Context ile global state yönetimi
- **Custom Hooks**: useTonConnect hook ile kolay kullanım
- **Dynamic Styling**: MutationObserver ile gerçek zamanlı stil uygulaması

## 🛠️ Teknolojiler

- **React 19.1.0** - En güncel UI framework
- **TypeScript 5.8.3** - Tip güvenliği
- **Vite 6.3.5** - Modern build tool
- **Redux Toolkit 2.8.2** - State management (✅ Aktif)
- **RTK Query** - API data fetching (✅ Aktif)
- **React Redux 9.2.0** - React-Redux bağlantısı (✅ Aktif)
- **Redux Persist 6.0.0** - State persistence (✅ Tamamlandı)
- **React Router DOM 7.6.1** - Client-side routing (✅ Aktif)
- **React Loading Skeleton 3.5.0** - Loading states (✅ Tamamlandı)
- **React Window 1.8.11** - Virtualization için performans optimizasyonu (✅ Tamamlandı)
- **React Window Infinite Loader 1.0.10** - Sonsuz scroll optimizasyonu (✅ Aktif)
- **React Virtualized Auto Sizer 1.0.26** - Otomatik boyutlandırma (✅ Aktif)
- **@tonconnect/ui-react 2.1.0** - TON blockchain cüzdan bağlantısı (✅ Aktif)
- **BlurHash 2.0.5** - Görsel placeholder sistemi (✅ Aktif)
- **React BlurHash 0.3.0** - React BlurHash entegrasyonu (✅ Aktif)
- **React Swipeable 7.0.2** - Touch gesture desteği (✅ Aktif)
- **React Intersection Observer 9.16.0** - Performans optimizasyonu (✅ Aktif)
- **@vercel/node 5.2.1** - Vercel Edge Functions için tip desteği (✅ Aktif)
- **CSS Modules** - Modüler stil yönetimi
- **Telegram WebApp SDK 7.10.1** - Telegram entegrasyonu
- **Telegram WebApp 2.0 API** - Bot API 8+ ile modern entegrasyon (✅ Tamamlandı)
- **Safe Area CSS Variables** - iOS/Android home indicator desteği (✅ Tamamlandı)
- **ESLint 9.25.0** - Code linting
- **Prettier 3.2.5** - Code formatting
- **Husky 9.0.11** - Git hooks
- **Commitlint** - Commit message standardı
- **SVGO 3.3.2** - SVG optimizasyonu
- **Vite Plugin SVG Icons 2.0.1** - SVG icon yönetimi
- **Sharp 0.34.2** - Görsel işleme ve optimizasyon (✅ Aktif)
- **Terser 5.36.0** - JavaScript minification (✅ Aktif)
- **Vite Plugin LQIP 0.0.5** - Low Quality Image Placeholder (✅ Aktif)

## 📄 Detaylı Proje Yapısı

```
/
├── .git/                           # Git repository
├── .husky/                         # Git hooks
│   ├── _/                         # Husky internal files
│   ├── commit-msg                 # Commit message validation
│   └── pre-commit                 # Pre-commit linting
├── .vercel/                       # Vercel deployment cache
├── dist/                          # Build output directory
├── node_modules/                  # NPM dependencies
├── scripts/                       # Build ve deployment scriptleri
├── api/                           # Vercel Edge Functions (✅ Aktif)
│   └── wallets.ts                 # TON wallets proxy (TypeScript) (1.4KB, 43 satır) - ✅ Güncel
├── public/                        # Static public files (2.5MB)
│   ├── fonts/                     # Font files (✅ Aktif)
│   │   ├── SF Pro Rounded.woff2   # SF Pro Rounded font (515KB)
│   │   └── SF Pro Rounded.woff    # SF Pro Rounded font (766KB)
│   ├── images/                    # Profile images only (2 dosya, ~1.2MB)
│   │   ├── profile-avatar.png     # Profil avatarı (612KB)
│   │   └── profile-image.png      # TabBar profil resmi (612KB)
│   ├── icons/                     # Public icon assets
│   ├── tonconnect-manifest.json   # TON Connect manifest dosyası (293B, 8 satır) - ✅ Aktif
│   └── vite.svg                   # Vite logo (1.5KB)
├── src/                           # Source code (1.2MB)
│   ├── core/                      # Core application modules (✅ Aktif)
│   │   ├── store/                 # Redux store configuration (✅ Aktif)
│   │   │   ├── store.ts           # Redux store setup (2.4KB, 65 satır) - ✅ Güncel
│   │   │   ├── hooks.ts           # Typed Redux hooks (371B, 8 satır)
│   │   │   └── index.ts           # Store exports (197B, 7 satır)
│   │   ├── api/                   # RTK Query API layer (✅ Aktif)
│   │   │   ├── notApi.ts          # API endpoints & types
│   │   │   ├── telegramApi.ts     # Telegram API integration (2.8KB, 77 satır)
│   │   │   └── index.ts           # API exports
│   │   ├── ui/                    # Reusable UI components (✅ Aktif)
│   │   │   ├── Icons/             # Icon components (6 dosya)
│   │   │   │   ├── BasketIcon.tsx     # Basket icon component
│   │   │   │   ├── CartTagIcon.tsx    # Cart tag icon component
│   │   │   │   ├── DeleteIcon.tsx     # Delete icon component
│   │   │   │   ├── SearchIcon.tsx     # Search icon component
│   │   │   │   ├── ShareIcon.tsx      # Share icon component
│   │   │   │   └── StoreIcon.tsx      # Store icon component
│   │   │   ├── Skeleton/          # Loading skeleton components (✅ Aktif)
│   │   │   │   ├── AppSkeleton.tsx    # App skeleton component (893B, 32 satır)
│   │   │   │   ├── AppSkeleton.module.css # App skeleton styles (2.2KB, 127 satır) - ✅ Aktif
│   │   │   │   ├── ItemPageSkeleton.tsx # Item page skeleton component (3.0KB, 90 satır) - ✅ Aktif
│   │   │   │   ├── ItemPageSkeleton.module.css # Item page skeleton styles (4.7KB, 261 satır) - ✅ Aktif
│   │   │   │   ├── ProductCardSkeleton.tsx # Product card skeleton (1.2KB, 38 satır) - ✅ Aktif
│   │   │   │   ├── ProductCardSkeleton.module.css # Product card skeleton styles (572B, 38 satır) - ✅ Aktif
│   │   │   │   ├── TabBarSkeleton.tsx # TabBar skeleton component (1.2KB, 39 satır) - ✅ Aktif
│   │   │   │   ├── HeaderSkeleton.tsx # Header skeleton component (607B, 23 satır) - ✅ Aktif
│   │   │   │   ├── AccountPageSkeleton.tsx # Account page skeleton component (2.7KB, 82 satır) - ✅ Aktif
│   │   │   │   ├── AccountPageSkeleton.module.css # Account page skeleton styles (3.2KB, 176 satır) - ✅ Aktif
│   │   │   │   ├── SkeletonElements.tsx # Reusable skeleton elements (1.6KB, 60 satır) - ✅ Aktif
│   │   │   │   └── index.ts           # Skeleton exports (500B, 11 satır) - ✅ Aktif
│   │   │   ├── ProgressiveImage/  # Progressive image loading (✅ Aktif)
│   │   │   │   ├── ProgressiveImage.module.css # Progressive image styles
│   │   │   │   ├── ProgressiveImage.tsx # Progressive image component
│   │   │   │   └── index.ts           # Progressive image export
│   │   │   ├── Modal/             # Modal system (✅ Aktif)
│   │   │   │   ├── Modal.module.css   # Modal styles
│   │   │   │   ├── Modal.tsx          # Modal component
│   │   │   │   └── index.ts           # Modal export
│   │   │   ├── Button/            # Button component
│   │   │   │   ├── Button.module.css  # Button styles
│   │   │   │   └── Button.tsx         # Button component
│   │   │   ├── ApiErrorMessage.tsx    # API hata mesajı bileşeni (1.9KB, 67 satır) - ✅ Aktif
│   │   │   ├── ApiErrorMessage.module.css # API hata mesajı stilleri (1.7KB, 109 satır) - ✅ Aktif
│   │   │   ├── EmptyState.tsx         # Boş durum bileşeni (2.0KB, 68 satır) - ✅ Aktif
│   │   │   ├── EmptyState.module.css  # Boş durum stilleri (1.7KB, 110 satır) - ✅ Aktif
│   │   │   ├── Icon.tsx               # Icon component (620B, 26 satır)
│   │   │   ├── Form.module.css        # Form styles (744B, 50 satır)
│   │   │   ├── Form.tsx               # Form component (3.7KB, 139 satır)
│   │   │   └── index.ts               # Component exports (1.0KB, 32 satır) - ✅ Aktif
│   │   ├── hooks/                 # Custom React hooks (✅ Aktif)
│   │   │   ├── useDebounce.ts         # Debounce hook
│   │   │   ├── useSkeletonTheme.ts    # Skeleton theme hook - ✅ Aktif
│   │   │   ├── useTelegramHeader.ts   # Telegram header ve buton yönetimi (✅ Tamamlandı)
│   │   │   ├── useSafeArea.tsx        # Safe area ve viewport yönetimi (✅ Tamamlandı)
│   │   │   ├── useSafeAreaExample.tsx # Safe area örnek kullanımı
│   │   │   └── index.ts               # Hooks exports
│   │   ├── styles/                # Global styles
│   │   │   ├── theme.css              # Global theme/reset dosyası (6.5KB, 281 satır) - ✅ Güncel
│   │   │   └── layout-helpers.css     # Responsive layout yardımcıları (468B, 21 satır) - ✅ YENİ
│   │   └── utils/                 # Core utility functions
│   ├── assets/                    # Import edilen assets (684KB)
│   │   ├── icons/                 # Figma SVG icons ve görseller (13 dosya) - ✅ Aktif
│   │   │   ├── basket-icon.svg    # Sepet ikonu (1.7KB)
│   │   │   ├── cart-tag-icon.svg  # Sepet durumu ikonu (969B)
│   │   │   ├── delete-icon.svg    # Silme ikonu (1.7KB)
│   │   │   ├── figma-share-icon.svg # Figma paylaş ikonu (2.2KB)
│   │   │   ├── figma-store-icon.svg # Figma mağaza ikonu (1.5KB)
│   │   │   ├── minus-circle.svg   # Azaltma ikonu (241B)
│   │   │   ├── minus-icon.svg     # Azaltma ikonu (1.0B) - ✅ Aktif
│   │   │   ├── plus-circle.svg    # Artırma ikonu (319B)
│   │   │   ├── plus-icon.svg      # Artırma ikonu (957B) - ✅ Aktif
│   │   │   ├── profile-image.png  # Profil resmi (612KB)
│   │   │   ├── search-icon.svg    # Arama ikonu (685B)
│   │   │   ├── share-icon.svg     # Paylaş ikonu (2.2KB)
│   │   │   └── store-icon.svg     # Mağaza ikonu (1.5KB)
│   │   ├── hatching_chick.svg     # Hatching chick icon (13KB)
│   │   └── react.svg              # React logo (4.0KB)
│   ├── features/                  # Feature-based modules
│   │   ├── account/               # Account/Profile feature
│   │   │   ├── AccountPage.module.css  # Account page styles (6.9KB, 392 satır) - ✅ Güncel
│   │   │   ├── AccountPage.tsx         # Account page component with skeleton integration (9.1KB, 255 satır) - ✅ Güncel
│   │   │   ├── api.ts                  # Account API functions (5.1KB, 138 satır) - ✅ Güncel
│   │   │   ├── userSlice.ts            # User state management (1.2KB, 48 satır) - ✅ Güncel
│   │   │   └── index.ts                # Account exports (135B, 5 satır)
│   │   ├── cart/                  # Cart feature (✅ Tamamlandı)
│   │   │   ├── CartModal.tsx      # Cart modal component
│   │   │   ├── CartModal.module.css # Cart modal styles
│   │   │   ├── cartSlice.ts       # Redux cart slice
│   │   │   ├── cartPersist.ts     # Persist configuration - ✅ Aktif
│   │   │   ├── selectors.ts       # Cart selectors
│   │   │   └── types.ts           # Cart TypeScript types
│   │   ├── catalogue/             # Product management (✅ Aktif)
│   │   │   ├── components/        # Product components
│   │   │   │   ├── ImageGallery.module.css  # Image gallery styles
│   │   │   │   ├── ImageGallery.tsx         # Image gallery component
│   │   │   │   ├── ItemPage.module.css      # Item page styles (8.4KB, 344 satır) - ✅ Responsive güncel
│   │   │   │   ├── ItemPage.tsx             # Item page component
│   │   │   │   ├── NoResultsFound.module.css # No results styles
│   │   │   │   ├── NoResultsFound.tsx       # No results component
│   │   │   │   ├── ProductCard.module.css   # Product card styles
│   │   │   │   ├── ProductCard.tsx          # Product card component
│   │   │   │   ├── ProductGrid.module.css   # Product grid styles
│   │   │   │   └── ProductGrid.tsx          # Product grid component
│   │   │   ├── __tests__/         # Test files
│   │   │   │   └── catalogueSlice.test.ts # Catalogue slice tests
│   │   │   ├── ProductGrid.module.css       # Main product grid styles
│   │   │   ├── ProductGrid.tsx              # Main product grid component
│   │   │   ├── api.ts                       # Products API functions
│   │   │   ├── types.ts                     # TypeScript types
│   │   │   └── index.ts                     # Catalogue exports
│   │   ├── search/                # Search feature (✅ Aktif)
│   │   │   ├── SearchBar.tsx      # Search bar component
│   │   │   └── index.ts           # Search export
│   │   ├── tonConnect/            # TON Connect blockchain integration (✅ Tamamlandı)
│   │   │   ├── TonConnectProvider.tsx # TON Connect React context provider (4.4KB, 136 satır) - ✅ Güncel
│   │   │   ├── TonConnectContext.ts   # TON Connect React context (277B, 6 satır) - ✅ Aktif
│   │   │   ├── TonConnectButton.tsx   # TON Connect wallet button component (1.2KB, 44 satır)
│   │   │   ├── TonConnectButton.module.css # TON Connect button styles (544B, 29 satır)
│   │   │   ├── SuccessModal.tsx       # Transaction success modal (951B, 32 satır) - ✅ Aktif
│   │   │   ├── SuccessModal.module.css # Success modal styles (2.9KB, 147 satır) - ✅ Aktif
│   │   │   ├── useTonConnect.ts       # TON Connect custom hook (666B, 21 satır)
│   │   │   ├── buyNow.ts              # Buy now transaction utilities (4.0KB, 119 satır)
│   │   │   ├── config.ts              # TON Connect configuration (537B, 22 satır) - ✅ Güncel
│   │   │   ├── utils/                 # TON Connect utilities (✅ Aktif)
│   │   │   │   └── dom.ts             # DOM manipulation helpers - ✅ Aktif
│   │   │   └── index.ts               # TON Connect exports (313B, 6 satır) - ✅ Aktif
│   │   ├── theme/                 # Theme feature
│   │   │   └── themeSlice.ts      # Theme slice (1.5KB, 54 satır) - ✅ Güncel
│   │   └── checkout/              # Checkout feature (geliştirme aşamasında)
│   │       ├── index.ts           # Checkout exports (133B, 4 satır)
│   │       └── components/        # Checkout components
│   ├── layouts/                   # Layout components
│   │   ├── Header/                # Header component
│   │   │   ├── Header.module.css  # Header styles
│   │   │   ├── Header.tsx         # Header component
│   │   │   └── index.ts           # Header export
│   │   ├── Footer/                # Footer component
│   │   │   ├── Footer.module.css  # Footer styles
│   │   │   ├── Footer.tsx         # Footer component
│   │   │   └── index.ts           # Footer export
│   │   ├── TabBar/                # Navigation TabBar
│   │   │   ├── TabBar.module.css  # TabBar styles - ✅ Responsive güncel
│   │   │   ├── TabBar.tsx         # TabBar component
│   │   │   └── index.ts           # TabBar export
│   │   ├── MainLayout.module.css  # Main layout styles
│   │   ├── MainLayout.tsx         # Main layout component - ✅ appContainer güncel
│   │   └── index.ts               # Layout exports
│   ├── utils/                     # Utility functions
│   │   ├── lqip.ts                # Low Quality Image Placeholder utilities
│   │   └── telegramHelpers.ts     # Telegram WebApp yardımcı fonksiyonları (✅ Tamamlandı)
│   ├── App.tsx                    # Main App component (5.3KB, 157 satır) - ✅ Aktif
│   ├── main.tsx                   # Application entry point (873B, 26 satır) - ✅ layout-helpers import güncel
│   ├── types.d.ts                 # Global type definitions (176B, 10 satır)
│   ├── vite-env.d.ts              # Vite type definitions (2.6KB, 118 satır)
│   ├── app.d.ts                   # App type definitions (boş dosya) - ✅ Aktif
│   ├── telegram-webapp-script.ts  # Telegram WebApp script (boş dosya) - ✅ Aktif
│   └── index.html                 # HTML entry point (1.1KB, 28 satır) - ✅ Aktif
├── .gitattributes                 # Git attributes (66B, 3 satır)
├── .gitignore                     # Git ignore rules (327B, 31 satır)
├── .prettierrc                    # Prettier configuration (179B, 11 satır)
├── README.md                      # Project documentation (48KB, 1074+ satır) - ✅ Güncel
├── commitlint.config.js           # Commit lint configuration (65B, 2 satır)
├── eslint.config.js               # ESLint configuration (1.0KB, 34 satır)
├── index.html                     # HTML entry point (988B, 32 satır) - ✅ Viewport güncel
├── package-lock.json              # NPM lock file (442KB, 12846 satır) - ✅ Aktif
├── package.json                   # NPM package configuration (2.2KB, 78 satır) - ✅ Aktif
├── tsconfig.app.json              # TypeScript app config (744B, 30 satır)
├── tsconfig.json                  # TypeScript main config (107B, 5 satır)
├── tsconfig.node.json             # TypeScript node config (630B, 26 satır)
├── vite.config.ts                 # Vite configuration (2.3KB, 73 satır)
├── vercel.json                    # Vercel deployment configuration (1.0KB, 33 satır) - ✅ CSP güncel
└── .DS_Store                      # macOS system file (8.0KB, 3 satır) - ✅ Aktif
```

### 📊 Dosya İstatistikleri - ✅ GÜNCEL

**Toplam Dosya Sayısı:** ~200+ dosya (node_modules ve .git hariç) - ✅ GÜNCEL

**Kategoriler:**

- **Kaynak Kod:** 115+ dosya (TypeScript/JavaScript/CSS) - ✅ GÜNCEL
- **API Endpoints:** 1 dosya (Vercel Edge Functions) - ✅ Aktif
- **Assets:** 13 dosya (SVG/PNG icons - src/assets/) - ✅ GÜNCEL
- **Public Images:** 2 dosya (PNG görselleri - public/images/) - ✅ Optimize Edildi
- **Public Fonts:** 2 dosya (SF Pro Rounded font ailesi - public/fonts/) - ✅ GÜNCEL
- **TON Connect Manifest:** 1 dosya (tonconnect-manifest.json) - ✅ Aktif
- **Konfigürasyon:** 23+ dosya (JSON/JS/TS/HTML)
- **Git/Husky:** 20+ dosya (.husky/ klasörü dahil)
- **Scripts:** Build ve deployment scriptleri
- **Vercel:** Deployment cache ve konfigürasyon dosyaları - ✅ Aktif

**Kod Satırları:**

- **TypeScript/TSX/CSS:** ~7,700+ satır - ✅ GÜNCEL
- **Toplam:** ~7,700+ satır kod

**Asset Boyutları:**

- **Public Klasörü:** 2.5MB (fonts + images + icons) - ✅ GÜNCEL
- **Src Klasörü:** 1.2MB (kod + assets) - ✅ GÜNCEL
- **Toplam Proje Boyutu:** ~3.7MB

## 🎯 Uygulama Akışı ve Navigasyon - ✅ GÜNCEL

### 🔄 State Management (Redux Toolkit) - ✅ AKTİF

```typescript
// Store yapısı (güncel)
interface RootState {
  notApi: ApiState; // ✅ RTK Query cache
  catalogue: CatalogueState; // ✅ Catalogue slice aktif
  cart: CartState; // ✅ Cart slice Tamamlandı
  // history: HistoryState // 🔄 Geliştirme aşamasında
  // theme: ThemeState    // 🔄 Gelecek geliştirme
}
```

### 🧭 Routing Yapısı - ✅ GÜNCEL

```typescript
// App.tsx içinde React Router DOM
<Routes>
  {/* Tam-ekran ürün detayı */}
  <Route path="product/:productId" element={<ItemPage />} />

  {/* TabBar + Header barındıran layout */}
  <Route element={<MainLayout onCartClick={handleCartClick} />}>
    <Route index element={<ProductGrid />} />
    <Route path="profile" element={<AccountPage />} />
  </Route>
</Routes>

// Route geçişleri:
// / → ProductGrid (ana sayfa)
// /product/:id → ItemPage (ürün detay)
// /profile → AccountPage (profil)
// Modal'lar → State-based (cart, search)
```

### 📱 Sayfa Yapısı - ✅ GÜNCEL

1. **Ana Sayfa (/)**: Header + ProductGrid + TabBar
2. **Ürün Detay (/product/:id)**: Tam ekran ItemPage + Footer
3. **Profil (/profile)**: AccountPage + TabBar
4. **Search Overlay**: SearchBar + blurred background (state-based)
5. **Cart Modal**: CartModal + backdrop (state-based)

## 🎯 Bileşen Mimarisi

### 🧩 Ana Bileşenler

#### **App.tsx** (5.3KB, 157 satır) - ✅ Aktif

- React Router DOM entegrasyonu
- Telegram WebApp SDK başlatma
- Redux Provider entegrasyonu
- TonConnectProvider entegrasyonu (✅ Aktif)
- Tema renkleri uygulama
- Cart modal state yönetimi
- Modern routing yapısı
- **Lazy Loading**: Code splitting ile performans optimizasyonu (✅ Aktif)
- **Suspense**: Loading fallback ile AppSkeleton ve ItemPageSkeleton (✅ Aktif)
- **SkeletonTheme**: React Loading Skeleton tema konfigürasyonu (✅ Aktif)
- **useSkeletonTheme**: Skeleton tema hook entegrasyonu (✅ Aktif)
- **useTelegramHeader**: Telegram header ve buton yönetimi (✅ Tamamlandı)
- **useSafeArea**: Safe area ve viewport yönetimi (✅ Tamamlandı)

#### **MainLayout.tsx**

- Header, content, TabBar düzeni
- Koşullu header gösterimi
- Search bar padding yönetimi
- Responsive layout yönetimi

#### **Redux Store (src/core/store/store.ts)** - ✅ GÜNCEL

- Redux Toolkit konfigürasyonu
- RTK Query middleware entegrasyonu
- TypeScript tip tanımları
- **Redux Persist**: State persistence entegrasyonu (✅ AKTİF)

#### **API Layer (src/core/api/notApi.ts)** - ✅ GÜNCEL

- RTK Query API slice
- Item ve Purchase interface'leri
- getCatalogue, getHistory, getEmptyHistory endpoint'leri
- Otomatik hook oluşturma
- API response transformation

#### **Catalogue Slice (src/features/catalogue/)** - ✅ GÜNCEL

- EntityAdapter ile normalleştirilmiş state
- RTK Query matcher'ları
- Loading/success/error state yönetimi
- Selector'lar

#### **SearchBar.tsx** - ✅ GÜNCEL

- Fixed positioning search overlay
- Auto focus ve keyboard support
- Blur background effect
- Cancel functionality
- useDebounce hook entegrasyonu

#### **CartModal.tsx** (5.0KB, 135 satır) - ✅ GÜNCEL

- Figma tasarımına uygun modal
- Redux cart state entegrasyonu
- Quantity artırma/azaltma
- Item ekleme/çıkarma
- Blur backdrop effect

#### **Modal.tsx** - ✅ GÜNCEL

- Genel modal bileşeni
- Backdrop click handling
- Children prop support
- CSS Modules styling

#### **TabBar.tsx**

- Store/Profile tab geçişi
- StoreIcon ve profil resmi
- Aktif tab vurgulama
- Click event handling

#### **ItemPage.tsx** (4.1KB, 125 satır) - ✅ GÜNCEL

- Tam ekran ürün detay sayfası
- Ürün bilgileri (başlık, açıklama, etiketler)
- Büyük ürün görseli
- 5'li ürün galeri slider
- ShareIcon ile paylaşım
- Footer entegrasyonu

#### **ProductGrid.tsx** (2.1KB, 63 satır) - ✅ GÜNCEL

- RTK Query ile veri çekme
- Loading/error state handling
- 2 sütunlu ürün grid'i
- ProductCard bileşenleri
- Ürün tıklama event'i

#### **ProductCard.tsx** (1.8KB, 55 satır) - ✅ GÜNCEL

- API Item tipini kullanma
- ImageGallery entegrasyonu
- Ürün bilgileri gösterimi
- Click handling

#### **ImageGallery.tsx** (1.8KB, 65 satır)

- Çoklu resim galerisi
- Pagination dots
- Resim geçişleri
- Touch/swipe desteği

#### **AccountPage.tsx**

- Profil sayfası
- Avatar ve kullanıcı bilgileri
- Koleksiyonlar placeholder

#### **Footer.tsx**

- Alt navigasyon
- ItemPage için özel footer
- TON Connect entegrasyonu ile "Buy Now" butonu (✅ Aktif)
- Cüzdan bağlantısı ve blockchain transaction yönetimi (✅ Aktif)

#### **NoResultsFound.tsx** (859B, 23 satır) - ✅ Aktif

- Arama sonucu bulunamadığında gösterilen bileşen
- Hatching chick icon ile görsel feedback
- Kullanıcı dostu mesaj

#### **Skeleton Components** - ✅ GÜNCEL

- **AppSkeleton.tsx**: Uygulama loading skeleton'ı (893B, 32 satır)
- **ItemPageSkeleton.tsx**: Ürün detay sayfası loading skeleton'ı (3.0KB, 90 satır) - ✅ GÜNCEL
- **ProductCardSkeleton.tsx**: Ürün kartı loading skeleton'ı (1.2KB, 38 satır) - ✅ GÜNCEL
- **TabBarSkeleton.tsx**: TabBar loading skeleton'ı (1.2KB, 39 satır) - ✅ GÜNCEL
- **HeaderSkeleton.tsx**: Header loading skeleton'ı (607B, 23 satır) - ✅ GÜNCEL
- **AccountPageSkeleton.tsx**: AccountPage loading skeleton'ı (2.7KB, 82 satır) - ✅ GÜNCEL
- **AccountPageSkeleton.module.css**: AccountPage skeleton styles (3.2KB, 176 satır) - ✅ GÜNCEL
- **SkeletonElements.tsx**: Yeniden kullanılabilir skeleton elementleri (1.6KB, 60 satır) - ✅ GÜNCEL
- **index.ts**: Skeleton exports (500B, 11 satır) - ✅ GÜNCEL
- **React Loading Skeleton**: Animasyonlu loading states
- **SkeletonTheme**: Tema uyumlu skeleton renkleri

### 🎨 Icon Bileşenleri

#### **ShareIcon.tsx** (292B, 12 satır)

- Paylaşım ikonu
- SVG path ile çizim
- ItemPage'de kullanım

#### **StoreIcon.tsx** (292B, 12 satır)

- Mağaza ikonu
- TabBar'da kullanım
- Aktif/pasif durumlar

#### **BasketIcon.tsx** (182B, 8 satır)

- Sepet ikonu
- Header'da kullanım

#### **SearchIcon.tsx** (182B, 8 satır) - ✅ GÜNCEL

- Arama ikonu
- Header'da kullanım

#### **CartTagIcon.tsx** (306B, 12 satır)

- Sepet durumu ikonu
- Beyaz daire + siyah checkmark SVG
- ProductCard'da sepet gösterimi

#### **DeleteIcon.tsx** (182B, 8 satır) - ✅ Aktif

- Silme ikonu
- Cart modal'da kullanım

### 🪝 Custom Hooks

#### **useDebounce.ts** (589B, 23 satır) - ✅ AKTİF

- Debounce functionality
- Search performans optimizasyonu
- Generic tip desteği
- Configurable delay

#### **useSkeletonTheme.ts** (689B, 20 satır) - ✅ Aktif

- Skeleton tema değerlerini yönetme
- Telegram tema entegrasyonu
- Memoized tema değerleri
- Performans optimizasyonu

#### **useTelegramHeader.ts** (2.5KB, 85 satır) - ✅ Tamamlandı

- Telegram WebApp 2.0 API entegrasyonu
- Sürüm kontrolü ile güvenli API çağrıları
- Şeffaf header ve tam ekran modu
- BackButton ve SettingsButton yönetimi
- Route-aware buton kontrolü
- Eski Telegram sürümleri ile uyumluluk

#### **useSafeArea.tsx** (6.1KB, 200 satır) - ✅ Tamamlandı

- iOS/Android safe area desteği
- Home indicator ve gesture bar uyumluluğu
- Dinamik viewport yüksekliği takibi
- CSS değişkenleri ile entegrasyon
- Telegram safe_area_changed event dinleme
- Native env() değerleri ile birleştirme

## 🎯 CSS Mimarisi

### ✅ Global CSS Konsolidasyonu

**Global Theme (`src/core/styles/theme.css`):**

- ✅ Tek kaynak CSS reset
- ✅ Telegram WebApp tema değişkenleri
- ✅ Safe area CSS değişkenleri (iOS/Android home indicator desteği)
- ✅ Dinamik viewport yüksekliği değişkenleri
- ✅ Safe area yardımcı sınıfları (.tg-safe-pad-_, .tg-safe-height-_)
- ✅ Typography sistemi (SF Pro font)
- ✅ Spacing sistemi (4px-20px)
- ✅ Color tokens
- ✅ Utility classes
- ✅ Animasyonlar (fadeIn)
- ✅ Responsive breakpoints
- ✅ TON Connect modal blur efekti stilleri (✅ Aktif)

**CSS Modules Stratejisi:**

- ✅ Her bileşen kendi `.module.css` dosyası
- ✅ Class name collision önleme
- ✅ TypeScript entegrasyonu
- ✅ Stil izolasyonu
- ✅ Safe area entegrasyonu (TabBar ve Footer için)

### 📁 CSS Dosya Dağılımı - ✅ GÜNCEL

```
ItemPage.module.css     - 6.2KB (322 satır) - En büyük stil dosyası
CartModal.module.css    - 5.3KB (277 satır)
ProductCard.module.css  - 1.9KB (91 satır)
AppSkeleton.module.css  - 2.2KB (127 satır)
ImageGallery.module.css - 1.4KB (87 satır)
NoResultsFound.module.css - 1016B (56 satır)
Form.module.css         - 744B (50 satır)
ProductCardSkeleton.module.css - 572B (38 satır)
ProductGrid.module.css  - 524B (29 satır)
ProductGrid (components) - 516B (29 satır)
```

## 🎯 Asset Yönetimi

### 📁 Public Assets (Statik - 5 dosya, ~3.9MB) - ✅ GÜNCEL

**Profil Görselleri:**

- `profile-avatar.png` - AccountPage avatarı (612KB)
- `profile-image.png` - TabBar profil resmi (612KB)

**Font Dosyaları:** - ✅ Aktif

- `SF Pro Rounded.woff2` - Modern web font (515KB)
- `SF Pro Rounded.woff` - Web font fallback (766KB)
- `SF Pro Rounded.ttf` - Desktop font (1.8MB)

**✅ Ürün Görselleri:** Artık tamamen API'den dinamik olarak yükleniyor!

### 📁 Src Assets (Dinamik - 13 dosya, ~3MB) - ✅ GÜNCEL

**SVG İkonlar:**

- `basket-icon.svg` - Sepet ikonu (1.7KB)
- `cart-tag-icon.svg` - Sepet durumu ikonu (969B)
- `delete-icon.svg` - Silme ikonu (1.7KB)
- `search-icon.svg` - Arama ikonu (685B)
- `share-icon.svg` - Paylaş ikonu (2.2KB)
- `store-icon.svg` - Mağaza ikonu (1.5KB)
- `figma-share-icon.svg` - Figma paylaş ikonu (2.2KB)
- `figma-store-icon.svg` - Figma mağaza ikonu (1.5KB)
- `minus-circle.svg` - Azaltma ikonu (241B)
- `minus-icon.svg` - Azaltma ikonu (1.0B) - ✅ Aktif
- `plus-circle.svg` - Artırma ikonu (319B)
- `plus-icon.svg` - Artırma ikonu (957B) - ✅ Aktif

**PNG/SVG Görseller:**

- `profile-image.png` - Assets'teki profil resmi (612KB)
- `hatching_chick.svg` - Hatching chick icon (13KB)
- `react.svg` - React logo (4.0KB)

### �� Asset Optimizasyonu Tamamlandı:\*\*

- ❌ Kullanılmayan 14 görsel dosyası silindi (~38MB tasarruf)
- ❌ figma-stickers/ klasörü kaldırıldı (5 dosya)
- ❌ Kullanılmayan sticker görselleri temizlendi
- ✅ Sadece profil görselleri korundu (API endpoint'i olmadığı için)
- ✅ Tüm ürün görselleri artık API'den dinamik olarak yükleniyor

**🎯 Dinamik Görsel Kullanımı:**

- **ProductCard** → `https://not-contest-cdn.openbuilders.xyz/items/X.jpg`
- **ItemPage** → `https://not-contest-cdn.openbuilders.xyz/items/X.jpg`
- **ImageGallery** → `https://not-contest-cdn.openbuilders.xyz/items/X.jpg`
- **Footer Cart** → `https://not-contest-cdn.openbuilders.xyz/items/X.jpg`
- **AccountPage History** → `https://not-contest-cdn.openbuilders.xyz/items/X.jpg`

## 🎯 API ve Veri Yapısı - ✅ GÜNCEL

### 📦 API Interface'leri - ✅ GÜNCEL

```typescript
// API Response Tip Güvenliği - ✅ YENİ
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

interface Item {
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

interface Purchase {
  timestamp: number; // Unix zaman damgası
  id: number; // ürün ID'si
  total: number;
  currency: string; // 'NOT'
}
```

### 🌐 RTK Query Endpoints - ✅ GÜNCEL

```typescript
// API endpoints
getCatalogue: builder.query<Item[], void>(); // GET /items.json
getHistory: builder.query<Purchase[], void>(); // GET /history.json
getEmptyHistory: builder.query<Purchase[], void>(); // GET /no_history.json - ✅ Aktif

// Otomatik oluşturulan hooks
useGetCatalogueQuery();
useGetHistoryQuery();
useGetEmptyHistoryQuery(); // ✅ Aktif
```

### 📦 API Hata İşleme - ✅ Aktif

```typescript
// Type guard ile tip kontrolü ve hata işleme
transformResponse: (response: unknown) => {
  // Tip kontrolü
  const typedResponse = response as ApiResponse<Item[]>;

  // Discriminated union pattern ile hata kontrolü
  if (!typedResponse.ok) {
    throw new Error(typedResponse.error.message || 'API Hatası');
  }

  return typedResponse.data;
}

// API Error Handling bileşeni
<ApiErrorMessage
  error={error}
  onRetry={() => refetch()}
  customMessage="Ürünleri yüklerken bir sorun oluştu."
/>
```

### 🏪 Redux State Yapısı - ✅ GÜNCEL

```typescript
interface RootState {
  notApi: {
    queries: { ... }        // RTK Query cache
    mutations: { ... }      // RTK Query mutations
  }
  products: {
    ids: number[]           // EntityAdapter normalleştirilmiş ID'ler
    entities: { [id]: Item } // EntityAdapter normalleştirilmiş entities
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
  }
  cart: {
    ids: number[]           // EntityAdapter normalleştirilmiş cart ID'ler
    entities: { [id]: CartItem } // EntityAdapter normalleştirilmiş cart items
  }
}
```

## 🎯 Gelecek Geliştirmeler - ✅ GÜNCEL

### ✅ Tamamlanan Özellikler (GÜNCEL):

- **Redux Persist**: State persistence (✅ Tamamlandı)
- **Skeleton Loading**: React Loading Skeleton entegrasyonu (✅ Tamamlandı)
- **Lazy Loading**: Code splitting (✅ Tamamlandı)
- **Virtualization**: React Window entegrasyonu (✅ Tamamlandı)
- **Advanced Skeleton System**: ItemPageSkeleton, TabBarSkeleton, HeaderSkeleton (✅ Aktif)
- **Skeleton Theme Hook**: useSkeletonTheme hook (✅ Aktif)
- **API Hata İşleme**: ApiErrorMessage bileşeni ve tip güvenliği (✅ Aktif)
- **Empty State Components**: EmptyState bileşeni (✅ Aktif)
- **Progressive Image Loading**: ProgressiveImage bileşeni (✅ Aktif)
- **Empty History API Entegrasyonu**: getEmptyHistory entegrasyonu (✅ Aktif)
- **TON Connect Integration**: Blockchain cüzdan bağlantısı ve ödeme sistemi (✅ Tamamlandı)
- **CSP Optimization**: Content Security Policy optimizasyonu ve Vercel uyumluluğu (✅ Aktif)
- **ESLint Compliance**: TypeScript strict mode ve lint kuralları uyumluluğu (✅ Aktif)
- **API Proxy System**: GitHub raw içeriği için proxy endpoint'leri (✅ Aktif)
- **DOM Utilities**: setBlur ve diğer DOM manipulation helpers (✅ Aktif)
- **Context Separation**: React Fast Refresh uyumluluğu için context ayrımı (✅ Aktif)
- **Telegram WebApp 2.0 Integration**: Bot API 8+ paradigması ile modern entegrasyon (✅ Tamamlandı)
- **Safe Area Support**: iOS/Android home indicator ve gesture bar desteği (✅ Tamamlandı)
- **Version Compatibility**: Telegram v6.0-8.0+ arası uyumluluk (✅ Tamamlandı)
- **Dynamic Viewport Management**: Klavye ve sistem çubuğu değişikliklerini takip (✅ Tamamlandı)
- **Transparent Header**: Şeffaf sistem başlığı ile modern görünüm (✅ Tamamlandı)
- **useTelegramHeader Hook**: Telegram header ve buton yönetimi (✅ Tamamlandı)
- **useSafeArea Hook**: Safe area ve viewport yönetimi (✅ Tamamlandı)
- **Telegram Helpers**: Sürüm tespiti ve özellik kontrolü yardımcı fonksiyonları (✅ Tamamlandı)

### ⚠️ Kritik Sorunlar:

- **History UI Geliştirme**: Sipariş geçmişi slice ve UI bileşenlerinin tamamlanması
- **Theme Slice**: Tema yönetimi
- **Animation System**: Geçiş animasyonları
- **Checkout Process**: Ödeme süreci

### 🔄 Devam Eden Geliştirmeler:

- **History UI**: Sipariş geçmişi slice ve UI bileşenlerinin tamamlanması
- **Theme Slice**: Tema yönetimi
- **Animation System**: Geçiş animasyonları
- **Checkout Process**: Ödeme süreci

### 📈 Kod Metrikleri - ✅ GÜNCEL:

- **Toplam Satır:** ~7,700+ satır - ✅ GÜNCEL
- **Component Sayısı:** 60+ bileşen - ✅ GÜNCEL
- **Feature Modülü:** 6 modül (1 geliştirme aşamasında) - ✅ GÜNCEL
- **Custom Hook:** 4 aktif hook (useDebounce, useSkeletonTheme, useTelegramHeader, useSafeArea) - ✅ GÜNCEL
- **Test Coverage:** Başlangıç seviyesi (1 test dosyası)
- **Bundle Size:** Optimize edilmiş (lazy loading ile)
- **Font Integration:** SF Pro Rounded font ailesi (✅ Aktif)
- **Error Handling:** API hata yönetimi ve boş durum bileşenleri (✅ Aktif)
- **TON Connect Integration:** Tam blockchain entegrasyonu (✅ Tamamlandı)
- **Image Optimization:** BlurHash, Progressive Loading, Sharp entegrasyonu (✅ Aktif)
- **Touch Gestures:** React Swipeable ile swipe desteği (✅ Aktif)
- **Performance Monitoring:** Intersection Observer ile görünürlük kontrolü (✅ Aktif)
- **Telegram WebApp 2.0:** Bot API 8+ ile modern entegrasyon (✅ Tamamlandı)
- **Safe Area Support:** iOS/Android home indicator desteği (✅ Tamamlandı)
- **Version Compatibility:** Telegram v6.0-8.0+ arası uyumluluk (✅ Tamamlandı)

## 🚨 Acil Yapılması Gerekenler

1. **History UI Geliştirme**: Sipariş geçmişi slice ve UI bileşenlerinin tamamlanması (API entegrasyonu mevcut)

2. **Theme Feature UI Geliştirme**: Mevcut slice'a UI bileşenlerinin eklenmesi

3. **Checkout Feature**: Yeni checkout feature'ının geliştirilmesi

4. **Utils Klasörü Genişletme**: Daha fazla utility fonksiyonunun eklenmesi

## 🔒 CSP ve Deployment Optimizasyonu - ✅ Aktif

### 🛡️ Content Security Policy (CSP)

Vercel deployment'ında Telegram Mini App CSP kısıtlamalarını aşmak için optimize edilmiş güvenlik politikası:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://telegram.org 'unsafe-inline' 'unsafe-hashes'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://not-contest-cdn.openbuilders.xyz https://api.telegram.org https://t.me https://*.telegram-cdn.org https://i.imgur.com blob:; connect-src 'self' https://api.telegram.org https://not-contest-cdn.openbuilders.xyz https://raw.githubusercontent.com; frame-ancestors https://t.me; font-src 'self' data:;"
        }
      ]
    }
  ]
}
```

### 🔧 ESLint Compliance

Husky pre-commit hook'larını geçmek için tüm TypeScript strict mode kurallarına uyumluluk:

- **@typescript-eslint/ban-ts-comment**: `@ts-ignore` yerine `@ts-expect-error` kullanımı
- **@typescript-eslint/no-explicit-any**: Tip güvenliği için `any` yerine spesifik tipler
- **react-refresh/only-export-components**: Fast Refresh uyumluluğu için context ayrımı

### 🎯 API Proxy System

GitHub raw içeriği için Vercel Edge Functions:

```typescript
// api/wallets.ts - TON Connect wallet listesi proxy (1.4KB, 43 satır)
export default async function handler(request: VercelRequest, response: VercelResponse) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const res = await fetch(
    'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json',
    {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Not-Store-TelegramMiniApp/1.0',
      },
      signal: controller.signal,
    }
  );

  response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
  response.status(200).send(await res.text());
}
```

### 📱 Responsive Layout System - ✅ YENİ

Telegram WebView'da farklı cihaz boyutlarında (320px-430px) mükemmel uyumluluk için:

```css
/* layout-helpers.css - 468B, 21 satır */
.appContainer {
  width: 100%; /* shrink on narrow phones */
  max-width: 390px; /* never exceed Figma canvas */
  margin-inline: auto; /* centre on tablets/desktop */
  box-sizing: border-box; /* include padding in width */
}

:root {
  --safe-bottom: env(safe-area-inset-bottom, 0);
}

.tg-safe-pad-bottom {
  padding-bottom: var(--safe-bottom);
}
```

**Uygulanan Düzeltmeler:**

- **MainLayout.tsx**: `appContainer` class'ı eklendi
- **AccountPage.tsx**: `appContainer` class'ı eklendi
- **ItemPage.module.css**: Responsive genişlik (100%, max-width: 390px)
- **TabBar.module.css**: Modern centring (margin-inline: auto)
- **index.html**: Viewport meta tag güncellemesi (viewport-fit=cover)

### 🎯 BotFather Domain Konfigürasyonu

Telegram BotFather'da `/setdomain` komutu ile eklenmesi gereken domainler:

1. `not-contest-cdn.openbuilders.xyz` - Ürün görselleri ve API
2. `raw.githubusercontent.com` - TON Connect wallet listesi (opsiyonel, proxy kullanılıyor)

### 🔄 DOM Utilities

Type-safe DOM manipulation için yardımcı fonksiyonlar:

```typescript
// src/features/tonConnect/utils/dom.ts
export function setBlur(el: HTMLElement, color: string = 'rgba(0, 0, 0, 0.7)'): void {
  el.style.backgroundColor = color;
  el.style.backdropFilter = 'blur(8px)';
  const css = el.style as CSSStyleDeclaration & { webkitBackdropFilter?: string };
  css.webkitBackdropFilter = 'blur(8px)';
}
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
