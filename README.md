# Not Store - Telegram Mini App

[Figma tasarımına](https://www.figma.com/design/CNyDh8dajidImm7mGiM0yL/Untitled?node-id=1-7892&t=c4ro1yHNezpapz6M-4) birebir uygun olarak geliştirilmiş modern bir Telegram Mini App e-ticaret uygulaması.

## 🚀 Özellikler

- **Figma Birebir Uyumluluk**: Tasarımdan direkt indirilen görseller ve ikonlar
- **Tam Ürün Detay Sayfası**: ItemPage ile detaylı ürün görüntüleme
- **Gelişmiş Navigasyon**: React Router DOM ile modern routing (✅ Aktif)
- **Redux Toolkit**: Modern state management (✅ Aktif)
- **RTK Query**: API data fetching ve caching (✅ Aktif)
- **Redux Persist**: State persistence (✅ Aktif)
- **Tam Sepet Sistemi**: Cart slice ve UI (✅ Tamamlandı)
- **Modal Sistemi**: Cart modal ve genel modal bileşeni (✅ Aktif)
- **Search Functionality**: Arama çubuğu özelliği (✅ Aktif)
- **History Feature**: Sipariş geçmişi yönetimi (✅ API entegrasyonu tamamlandı)
- **API Error Handling**: Gelişmiş hata yönetimi (✅ YENİ)
- **Empty State Components**: Boş durum bileşenleri (✅ YENİ)
- **Progressive Image Loading**: Görsel yükleme optimizasyonu (✅ YENİ)
- **Custom Hooks**: useDebounce ve useSkeletonTheme hooks (✅ Aktif)
- **Skeleton Loading**: React Loading Skeleton ile loading states (✅ Aktif)
- **Lazy Loading**: Code splitting ve performance optimizasyonu (✅ Aktif)
- **Virtualization**: React Window ile performans optimizasyonu (✅ Aktif)
- **TON Connect Integration**: Blockchain cüzdan bağlantısı ve ödeme sistemi (✅ TAMAMLANDı)
- **CSP Optimization**: Content Security Policy optimizasyonu ve Vercel uyumluluğu (✅ YENİ)
- **ESLint Compliance**: TypeScript strict mode ve lint kuralları uyumluluğu (✅ YENİ)
- **API Proxy System**: GitHub raw içeriği için proxy endpoint'leri (✅ YENİ)
- **Optimized Asset Management**: Statik görseller public/, dinamik ikonlar src/assets/
- **CSS Modules Architecture**: Tek global theme + modüler bileşen stilleri
- **Clean Project Structure**: Tutarlı isimlendirme ve optimize edilmiş klasör yapısı
- **Telegram WebApp SDK**: Tam Telegram entegrasyonu
- **Responsive Tasarım**: 390px mobil odaklı responsive yapı
- **Modüler Mimari**: Temiz ve sürdürülebilir kod yapısı
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi
- **Git Hooks**: Husky ile pre-commit ve commit-msg kontrolü
- **Code Quality**: ESLint, Prettier ve lint-staged entegrasyonu
- **Custom Font Integration**: SF Pro Rounded font ailesi (✅ YENİ)

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

### 🛒 Sepet Sistemi (✅ TAMAMLANDı)

- **Redux Cart Slice**: EntityAdapter ile normalleştirilmiş state
- **Cart Modal**: Figma uyumlu sepet arayüzü
- **Quantity Management**: Artırma/azaltma butonları
- **Cart Selectors**: Memoized selector'lar
- **⚠️ Redux Persist**: Henüz yüklenmemiş (gelecek geliştirme)

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

### 💰 TON Connect Integration (✅ TAMAMLANDı)

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
- **Redux Persist 6.0.0** - State persistence (✅ Aktif)
- **React Router DOM 7.6.1** - Client-side routing (✅ Aktif)
- **React Loading Skeleton 3.5.0** - Loading states (✅ Aktif)
- **React Window 1.8.11** - Virtualization için performans optimizasyonu (✅ Aktif)
- **React Window Infinite Loader 1.0.10** - Sonsuz scroll optimizasyonu (✅ Aktif)
- **React Virtualized Auto Sizer 1.0.26** - Otomatik boyutlandırma (✅ Aktif)
- **@tonconnect/sdk** - TON blockchain cüzdan bağlantısı (✅ YENİ)
- **@tonconnect/ui** - TON Connect UI bileşenleri (✅ YENİ)
- **@vercel/node** - Vercel Edge Functions için tip desteği (✅ YENİ)
- **CSS Modules** - Modüler stil yönetimi
- **Telegram WebApp SDK 8.0.2** - Telegram entegrasyonu
- **ESLint 9.25.0** - Code linting
- **Prettier 3.2.5** - Code formatting
- **Husky 9.0.11** - Git hooks
- **Commitlint** - Commit message standardı
- **SVGO 3.3.2** - SVG optimizasyonu
- **Vite Plugin SVG Icons 2.0.1** - SVG icon yönetimi

## 📁 Detaylı Proje Yapısı

```
/
├── .git/                           # Git repository
├── .husky/                         # Git hooks
│   ├── _/                         # Husky internal files
│   ├── commit-msg                 # Commit message validation (88B)
│   └── pre-commit                 # Pre-commit linting (66B)
├── dist/                          # Build output directory
├── node_modules/                  # NPM dependencies
├── scripts/                       # Build ve deployment scriptleri
├── api/                           # Vercel Edge Functions (✅ YENİ)
│   └── wallets.ts                 # TON wallets proxy (TypeScript) (1.2KB, 28 satır)
├── public/                        # Static public files
│   ├── fonts/                     # Font files (✅ GÜNCEL)
│   │   ├── SF Pro Rounded.woff2   # SF Pro Rounded font (515KB)
│   │   └── SF Pro Rounded.woff    # SF Pro Rounded font (766KB)
│   ├── images/                    # Profile images only (2 dosya, ~1.2MB)
│   │   ├── profile-avatar.png     # Profil avatarı (612KB)
│   │   └── profile-image.png      # TabBar profil resmi (612KB)
│   ├── icons/                     # Public icon assets
│   ├── tonconnect-manifest.json   # TON Connect manifest dosyası (201B, 7 satır) - ✅ TAMAMLANDı
│   └── vite.svg                   # Vite logo (1.5KB)
├── src/                           # Source code
│   ├── app/                       # Redux store configuration (✅ GÜNCEL)
│   │   ├── store.ts               # Redux store setup (2.0KB, 49 satır)
│   │   └── hooks.ts               # Typed Redux hooks (371B, 7 satır)
│   ├── api/                       # RTK Query API layer (✅ GÜNCEL)
│   │   └── notApi.ts              # API endpoints & types (1.9KB, 62 satır)
│   ├── assets/                    # Import edilen assets
│   │   ├── icons/                 # Figma SVG icons ve görseller (13 dosya) - ✅ GÜNCEL
│   │   │   ├── basket-icon.svg    # Sepet ikonu (1.7KB)
│   │   │   ├── cart-tag-icon.svg  # Sepet durumu ikonu (969B)
│   │   │   ├── delete-icon.svg    # Silme ikonu (1.7KB)
│   │   │   ├── figma-share-icon.svg # Figma paylaş ikonu (2.2KB)
│   │   │   ├── figma-store-icon.svg # Figma mağaza ikonu (1.5KB)
│   │   │   ├── minus-circle.svg   # Azaltma ikonu (241B)
│   │   │   ├── minus-icon.svg     # Azaltma ikonu (1.0B) - ✅ YENİ
│   │   │   ├── plus-circle.svg    # Artırma ikonu (319B)
│   │   │   ├── plus-icon.svg      # Artırma ikonu (957B) - ✅ YENİ
│   │   │   ├── profile-image.png  # Profil resmi (612KB)
│   │   │   ├── search-icon.svg    # Arama ikonu (685B)
│   │   │   ├── share-icon.svg     # Paylaş ikonu (2.2KB)
│   │   │   └── store-icon.svg     # Mağaza ikonu (1.5KB)
│   │   ├── hatching_chick.svg     # Hatching chick icon (13KB)
│   │   └── react.svg              # React logo (4.0KB)
│   ├── components/                # Reusable UI components
│   │   ├── Icons/                 # Icon components (6 dosya)
│   │   │   ├── BasketIcon.tsx     # Basket icon component (182B, 8 satır)
│   │   │   ├── CartTagIcon.tsx    # Cart tag icon component (306B, 12 satır)
│   │   │   ├── DeleteIcon.tsx     # Delete icon component (182B, 8 satır)
│   │   │   ├── SearchIcon.tsx     # Search icon component (182B, 8 satır)
│   │   │   ├── ShareIcon.tsx      # Share icon component (292B, 12 satır)
│   │   │   └── StoreIcon.tsx      # Store icon component (292B, 12 satır)
│   │   ├── Skeleton/              # Loading skeleton components (✅ GÜNCEL)
│   │   │   ├── AppSkeleton.tsx    # App skeleton component (905B, 31 satır)
│   │   │   ├── AppSkeleton.module.css # App skeleton styles (2.2KB, 122 satır) - ✅ GÜNCEL
│   │   │   ├── ItemPageSkeleton.tsx # Item page skeleton component (3.0KB, 95 satır) - ✅ GÜNCEL
│   │   │   ├── ItemPageSkeleton.module.css # Item page skeleton styles (4.7KB, 260 satır) - ✅ GÜNCEL
│   │   │   ├── ProductCardSkeleton.tsx # Product card skeleton (1.2KB, 37 satır) - ✅ GÜNCEL
│   │   │   ├── ProductCardSkeleton.module.css # Product card skeleton styles (572B, 37 satır) - ✅ GÜNCEL
│   │   │   ├── TabBarSkeleton.tsx # TabBar skeleton component (1.2KB, 38 satır) - ✅ GÜNCEL
│   │   │   ├── HeaderSkeleton.tsx # Header skeleton component (607B, 22 satır) - ✅ GÜNCEL
│   │   │   ├── AccountPageSkeleton.tsx # Account page skeleton component (2.7KB, 81 satır) - ✅ YENİ
│   │   │   ├── AccountPageSkeleton.module.css # Account page skeleton styles (3.2KB, 176 satır) - ✅ YENİ
│   │   │   ├── SkeletonElements.tsx # Reusable skeleton elements (1.6KB, 66 satır) - ✅ YENİ
│   │   │   └── index.ts           # Skeleton exports (500B, 10 satır) - ✅ GÜNCEL
│   │   ├── ProgressiveImage/      # Progressive image loading (✅ YENİ)
│   │   │   ├── ProgressiveImage.module.css # Progressive image styles (1.2KB, 32 satır)
│   │   │   ├── ProgressiveImage.tsx # Progressive image component (3.5KB, 117 satır)
│   │   │   └── index.ts           # Progressive image export (34B, 1 satır)
│   │   ├── Modal/                 # Modal system (✅ GÜNCEL)
│   │   │   ├── Modal.module.css   # Modal styles (773B, 42 satır)
│   │   │   ├── Modal.tsx          # Modal component (604B, 26 satır)
│   │   │   └── index.ts           # Modal export (34B, 1 satır)
│   │   ├── TabBar/                # Navigation TabBar
│   │   │   ├── TabBar.module.css  # TabBar styles (1.6KB, 108 satır)
│   │   │   ├── TabBar.tsx         # TabBar component (1.5KB, 52 satır)
│   │   │   └── index.ts           # TabBar export (35B, 1 satır)
│   │   ├── Header/                # Header component
│   │   │   ├── Header.module.css  # Header styles (2.9KB, 174 satır)
│   │   │   ├── Header.tsx         # Header component (3.5KB, 118 satır)
│   │   │   └── index.ts           # Header export (35B, 1 satır)
│   │   ├── Footer/                # Footer component
│   │   │   ├── Footer.module.css  # Footer styles (2.9KB, 126 satır)
│   │   │   ├── Footer.tsx         # Footer component (3.0KB, 109 satır)
│   │   │   └── index.ts           # Footer export (35B, 1 satır)
│   │   ├── Button/                # Button component
│   │   │   ├── Button.module.css  # Button styles (742B, 41 satır)
│   │   │   └── Button.tsx         # Button component (753B, 32 satır)
│   │   ├── ApiErrorMessage.tsx    # API hata mesajı bileşeni (1.8KB, 58 satır) - ✅ YENİ
│   │   ├── ApiErrorMessage.module.css # API hata mesajı stilleri (1.6KB, 90 satır) - ✅ YENİ
│   │   ├── EmptyState.tsx         # Boş durum bileşeni (2.0KB, 75 satır) - ✅ YENİ
│   │   ├── EmptyState.module.css  # Boş durum stilleri (1.6KB, 91 satır) - ✅ YENİ
│   │   ├── Icon.tsx               # Icon component (648B, 25 satır)
│   │   ├── Form.module.css        # Form styles (744B, 49 satır)
│   │   ├── Form.tsx               # Form component (3.7KB, 132 satır)
│   │   └── index.ts               # Component exports (898B, 22 satır) - ✅ GÜNCEL
│   ├── features/                  # Feature-based modules
│   │   ├── account/               # Account/Profile feature
│   │   │   ├── AccountPage.module.css  # Account page styles (5.8KB, 308 satır)
│   │   │   ├── AccountPage.tsx         # Account page component with skeleton integration (4.0KB, 105 satır) - ✅ GÜNCEL
│   │   │   └── api.ts                  # Account API functions (4.5KB, 150 satır)
│   │   ├── cart/                  # Cart feature (✅ TAMAMLANDı)
│   │   │   ├── CartModal.tsx      # Cart modal component (5.0KB, 135 satır)
│   │   │   ├── CartModal.module.css # Cart modal styles (5.3KB, 277 satır)
│   │   │   ├── cartSlice.ts       # Redux cart slice (1.5KB, 52 satır)
│   │   │   ├── cartPersist.ts     # Persist configuration (412B, 14 satır) - ✅ Aktif
│   │   │   ├── selectors.ts       # Cart selectors (1.1KB, 31 satır)
│   │   │   └── types.ts           # Cart TypeScript types (158B, 9 satır)
│   │   ├── products/              # Product management (✅ GÜNCEL)
│   │   │   ├── components/        # Product components
│   │   │   │   ├── ImageGallery.module.css  # Image gallery styles (1.4KB, 87 satır)
│   │   │   │   ├── ImageGallery.tsx         # Image gallery component (1.8KB, 65 satır)
│   │   │   │   ├── ItemPage.module.css      # Item page styles (6.2KB, 322 satır)
│   │   │   │   ├── ItemPage.tsx             # Item page component (4.1KB, 125 satır)
│   │   │   │   ├── NoResultsFound.module.css # No results styles (1016B, 56 satır)
│   │   │   │   ├── NoResultsFound.tsx       # No results component (859B, 23 satır)
│   │   │   │   ├── ProductCard.module.css   # Product card styles (1.9KB, 91 satır)
│   │   │   │   ├── ProductCard.tsx          # Product card component (1.8KB, 55 satır)
│   │   │   │   ├── ProductGrid.module.css   # Product grid styles (516B, 29 satır)
│   │   │   │   └── ProductGrid.tsx          # Product grid component (806B, 30 satır)
│   │   │   ├── __tests__/         # Test files
│   │   │   │   └── productsSlice.test.ts # Products slice tests (585B, 21 satır)
│   │   │   ├── ProductGrid.module.css       # Main product grid styles (524B, 29 satır)
│   │   │   ├── ProductGrid.tsx              # Main product grid component (2.1KB, 63 satır)
│   │   │   ├── api.ts                       # Products API functions (3.3KB, 111 satır)
│   │   │   └── types.ts                     # TypeScript types (126B, 4 satır)
│   │   ├── search/                # Search feature (✅ GÜNCEL)
│   │   │   ├── SearchBar.tsx      # Search bar component (2.3KB, 78 satır)
│   │   │   └── index.ts           # Search export (41B, 1 satır)
│   │   ├── tonConnect/            # TON Connect blockchain integration (✅ TAMAMLANDı)
│   │   │   ├── TonConnectProvider.tsx # TON Connect React context provider (4.2KB, 130 satır) - ✅ GÜNCEL
│   │   │   ├── TonConnectContext.ts   # TON Connect React context (250B, 6 satır) - ✅ YENİ
│   │   │   ├── TonConnectButton.tsx   # TON Connect wallet button component (1.2KB, 45 satır)
│   │   │   ├── TonConnectButton.module.css # TON Connect button styles (528B, 24 satır)
│   │   │   ├── SuccessModal.tsx       # Transaction success modal (987B, 37 satır) - ✅ YENİ
│   │   │   ├── SuccessModal.module.css # Success modal styles (2.8KB, 133 satır) - ✅ YENİ
│   │   │   ├── useTonConnect.ts       # TON Connect custom hook (666B, 20 satır)
│   │   │   ├── buyNow.ts              # Buy now transaction utilities (3.9KB, 111 satır)
│   │   │   ├── config.ts              # TON Connect configuration (580B, 22 satır) - ✅ GÜNCEL
│   │   │   ├── utils/                 # TON Connect utilities (✅ YENİ)
│   │   │   │   └── dom.ts             # DOM manipulation helpers (420B, 12 satır) - ✅ YENİ
│   │   │   └── index.ts               # TON Connect exports (320B, 6 satır) - ✅ GÜNCEL
│   │   └── theme/                 # Theme feature (boş - gelecek geliştirme)
│   │       └── themeSlice.ts      # Theme slice (1.6KB, 53 satır)
│   ├── hooks/                     # Custom React hooks (✅ GÜNCEL)
│   │   ├── useDebounce.ts         # Debounce hook (589B, 23 satır)
│   │   └── useSkeletonTheme.ts    # Skeleton theme hook (689B, 20 satır) - ✅ YENİ
│   ├── layouts/                   # Layout components
│   │   ├── MainLayout.module.css  # Main layout styles (453B, 22 satır)
│   │   └── MainLayout.tsx         # Main layout component (1.3KB, 46 satır)
│   ├── styles/                    # Global styles
│   │   └── theme.css              # Global theme/reset dosyası (2.7KB, 140 satır)
│   ├── utils/                     # Utility functions
│   │   └── lqip.ts                # Low Quality Image Placeholder utilities (512B, 17 satır)
│   ├── App.tsx                    # Main App component (3.2KB, 85 satır) - ✅ GÜNCEL
│   ├── main.tsx                   # Application entry point (687B, 22 satır)
│   ├── types.d.ts                 # Global type definitions (176B, 9 satır)
│   └── vite-env.d.ts              # Vite type definitions (1.0KB, 54 satır)
├── .gitattributes                 # Git attributes (66B, 3 satır)
├── .gitignore                     # Git ignore rules (253B, 25 satır)
├── .prettierrc                    # Prettier configuration (179B, 10 satır)
├── README.md                      # Project documentation (37KB, 821 satır) - ✅ GÜNCEL
├── commitlint.config.js           # Commit lint configuration (62B, 1 satır)
├── eslint.config.js               # ESLint configuration (934B, 34 satır)
├── index.html                     # HTML entry point (803B, 24 satır)
├── package-lock.json              # NPM lock file (380KB, 11070 satır) - ✅ GÜNCEL
├── package.json                   # NPM package configuration (2.1KB, 74 satır) - ✅ GÜNCEL
├── tsconfig.app.json              # TypeScript app config (748B, 30 satır)
├── tsconfig.json                  # TypeScript main config (119B, 8 satır)
├── tsconfig.node.json             # TypeScript node config (630B, 26 satır)
└── vite.config.ts                 # Vite configuration (1.7KB, 56 satır)
```

### 📊 Dosya İstatistikleri - ✅ GÜNCEL

**Toplam Dosya Sayısı:** ~175+ dosya (node_modules ve .git hariç) - ✅ GÜNCEL

**Kategoriler:**

- **Kaynak Kod:** 105+ dosya (TypeScript/JavaScript/CSS) - ✅ GÜNCEL
- **API Endpoints:** 1 dosya (Vercel Edge Functions) - ✅ YENİ
- **Assets:** 13 dosya (SVG/PNG icons - src/assets/) - ✅ GÜNCEL
- **Public Images:** 2 dosya (PNG görselleri - public/images/) - ✅ OPTİMİZE EDİLDİ
- **Public Fonts:** 2 dosya (SF Pro Rounded font ailesi - public/fonts/) - ✅ GÜNCEL
- **TON Connect Manifest:** 1 dosya (tonconnect-manifest.json) - ✅ TAMAMLANDı
- **Konfigürasyon:** 15 dosya (JSON/JS/TS)
- **Git/Husky:** 20+ dosya (.husky/ klasörü dahil)
- **Scripts:** Build ve deployment scriptleri

**Kod Satırları:**

- **TypeScript/TSX/CSS:** ~7,200+ satır - ✅ GÜNCEL
- **Toplam:** ~7,200+ satır kod

## 🎯 Uygulama Akışı ve Navigasyon - ✅ GÜNCEL

### 🔄 State Management (Redux Toolkit) - ✅ AKTİF

```typescript
// Store yapısı (güncel)
interface RootState {
  notApi: ApiState; // ✅ RTK Query cache
  products: ProductState; // ✅ Products slice aktif
  cart: CartState; // ✅ Cart slice TAMAMLANDı
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

#### **App.tsx** (3.2KB, 85 satır) - ✅ GÜNCEL

- React Router DOM entegrasyonu
- Telegram WebApp SDK başlatma
- Redux Provider entegrasyonu
- TonConnectProvider entegrasyonu (✅ YENİ)
- Tema renkleri uygulama
- Cart modal state yönetimi
- Modern routing yapısı
- **Lazy Loading**: Code splitting ile performans optimizasyonu (✅ YENİ)
- **Suspense**: Loading fallback ile AppSkeleton ve ItemPageSkeleton (✅ YENİ)
- **SkeletonTheme**: React Loading Skeleton tema konfigürasyonu (✅ YENİ)
- **useSkeletonTheme**: Skeleton tema hook entegrasyonu (✅ YENİ)

#### **MainLayout.tsx**

- Header, content, TabBar düzeni
- Koşullu header gösterimi
- Search bar padding yönetimi
- Responsive layout yönetimi

#### **Redux Store (store.ts)** - ✅ GÜNCEL

- Redux Toolkit konfigürasyonu
- RTK Query middleware entegrasyonu
- TypeScript tip tanımları
- **Redux Persist**: State persistence entegrasyonu (✅ AKTİF)

#### **API Layer (notApi.ts)** - ✅ GÜNCEL

- RTK Query API slice
- Item ve Purchase interface'leri
- getCatalogue, getHistory, getEmptyHistory endpoint'leri
- Otomatik hook oluşturma
- API response transformation

#### **Products Slice (productsSlice.ts)** - ✅ GÜNCEL

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
- TON Connect entegrasyonu ile "Buy Now" butonu (✅ YENİ)
- Cüzdan bağlantısı ve blockchain transaction yönetimi (✅ YENİ)

#### **NoResultsFound.tsx** (859B, 23 satır) - ✅ YENİ

- Arama sonucu bulunamadığında gösterilen bileşen
- Hatching chick icon ile görsel feedback
- Kullanıcı dostu mesaj

#### **Skeleton Components** - ✅ GÜNCEL

- **AppSkeleton.tsx**: Uygulama loading skeleton'ı (905B, 31 satır)
- **ItemPageSkeleton.tsx**: Ürün detay sayfası loading skeleton'ı (3.0KB, 95 satır) - ✅ GÜNCEL
- **ProductCardSkeleton.tsx**: Ürün kartı loading skeleton'ı (1.2KB, 37 satır) - ✅ GÜNCEL
- **TabBarSkeleton.tsx**: TabBar loading skeleton'ı (1.2KB, 38 satır) - ✅ GÜNCEL
- **HeaderSkeleton.tsx**: Header loading skeleton'ı (607B, 22 satır) - ✅ GÜNCEL
- **AccountPageSkeleton.tsx**: AccountPage loading skeleton'ı (2.7KB, 81 satır) - ✅ YENİ
- **AccountPageSkeleton.module.css**: AccountPage skeleton styles (3.2KB, 176 satır) - ✅ YENİ
- **SkeletonElements.tsx**: Yeniden kullanılabilir skeleton elementleri (1.6KB, 66 satır) - ✅ YENİ
- **index.ts**: Skeleton exports (500B, 10 satır) - ✅ GÜNCEL
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

#### **DeleteIcon.tsx** (182B, 8 satır) - ✅ YENİ

- Silme ikonu
- Cart modal'da kullanım

### 🪝 Custom Hooks

#### **useDebounce.ts** (589B, 23 satır) - ✅ AKTİF

- Debounce functionality
- Search performans optimizasyonu
- Generic tip desteği
- Configurable delay

#### **useSkeletonTheme.ts** (689B, 20 satır) - ✅ YENİ

- Skeleton tema değerlerini yönetme
- Telegram tema entegrasyonu
- Memoized tema değerleri
- Performans optimizasyonu

## 🎯 CSS Mimarisi

### ✅ Global CSS Konsolidasyonu

**Global Theme (`src/styles/theme.css`):**

- ✅ Tek kaynak CSS reset
- ✅ Telegram WebApp tema değişkenleri
- ✅ Typography sistemi (SF Pro font)
- ✅ Spacing sistemi (4px-20px)
- ✅ Color tokens
- ✅ Utility classes
- ✅ Animasyonlar (fadeIn)
- ✅ Responsive breakpoints
- ✅ TON Connect modal blur efekti stilleri (✅ YENİ)

**CSS Modules Stratejisi:**

- ✅ Her bileşen kendi `.module.css` dosyası
- ✅ Class name collision önleme
- ✅ TypeScript entegrasyonu
- ✅ Stil izolasyonu

### 📁 CSS Dosya Dağılımı - ✅ GÜNCEL

```
ItemPage.module.css     - 6.2KB (322 satır) - En büyük stil dosyası
CartModal.module.css    - 5.3KB (277 satır)
ProductCard.module.css  - 1.9KB (91 satır)
AppSkeleton.module.css  - 2.2KB (122 satır)
ImageGallery.module.css - 1.4KB (87 satır)
NoResultsFound.module.css - 1016B (56 satır)
Form.module.css         - 744B (49 satır)
ProductCardSkeleton.module.css - 572B (37 satır)
ProductGrid.module.css  - 524B (29 satır)
ProductGrid (components) - 516B (29 satır)
```

## 🎯 Asset Yönetimi

### 📁 Public Assets (Statik - 5 dosya, ~3.9MB) - ✅ GÜNCEL

**Profil Görselleri:**

- `profile-avatar.png` - AccountPage avatarı (612KB)
- `profile-image.png` - TabBar profil resmi (612KB)

**Font Dosyaları:** - ✅ YENİ

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
- `minus-icon.svg` - Azaltma ikonu (1.0B) - ✅ YENİ
- `plus-circle.svg` - Artırma ikonu (319B)
- `plus-icon.svg` - Artırma ikonu (957B) - ✅ YENİ

**PNG/SVG Görseller:**

- `profile-image.png` - Assets'teki profil resmi (612KB)
- `hatching_chick.svg` - Hatching chick icon (13KB)
- `react.svg` - React logo (4.0KB)

### 🎯 Asset Optimizasyon Stratejisi

**Public Klasörü Avantajları:**

- ✅ Build sırasında bundle'a dahil edilmez
- ✅ Doğrudan URL ile erişim (sadece profil görselleri için)
- ✅ Daha hızlı build süresi
- ✅ Daha küçük bundle boyutu
- ✅ CDN optimizasyonu için uygun

**Src/Assets Kullanımı:**

- ✅ Küçük SVG ikonlar için (13 dosya)
- ✅ Import edilerek kullanım
- ✅ TypeScript tip kontrolü
- ✅ Tree-shaking desteği

**✅ Asset Optimizasyonu Tamamlandı:**

- ❌ Kullanılmayan 14 görsel dosyası silindi (~38MB tasarruf)
- ❌ figma-stickers/ klasörü kaldırıldı (5 dosya)
- ❌ Kullanılmayan sticker görselleri temizlendi
- ❌ Static product görselleri kaldırıldı (6 dosya, ~46MB tasarruf) - ✅ YENİ
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
getEmptyHistory: builder.query<Purchase[], void>(); // GET /no_history.json - ✅ YENİ ENTEGRASYONu

// Otomatik oluşturulan hooks
useGetCatalogueQuery();
useGetHistoryQuery();
useGetEmptyHistoryQuery(); // ✅ YENİ KULLANIM
```

### 📦 API Hata İşleme - ✅ YENİ

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

- **Redux Persist**: State persistence (✅ TAMAMLANDı)
- **Skeleton Loading**: Loading states (✅ TAMAMLANDı)
- **Lazy Loading**: Code splitting (✅ TAMAMLANDı)
- **Virtualization**: React Window entegrasyonu (✅ TAMAMLANDı)
- **Advanced Skeleton System**: ItemPageSkeleton, TabBarSkeleton, HeaderSkeleton (✅ YENİ)
- **Skeleton Theme Hook**: useSkeletonTheme hook (✅ YENİ)
- **API Hata İşleme**: ApiErrorMessage bileşeni ve tip güvenliği (✅ YENİ)
- **Empty State Components**: EmptyState bileşeni (✅ YENİ)
- **Progressive Image Loading**: ProgressiveImage bileşeni (✅ YENİ)
- **Empty History API Entegrasyonu**: getEmptyHistory entegrasyonu (✅ YENİ)
- **TON Connect Integration**: Blockchain cüzdan bağlantısı ve ödeme sistemi (✅ TAMAMLANDı)
- **CSP Optimization**: Content Security Policy optimizasyonu ve Vercel uyumluluğu (✅ YENİ)
- **ESLint Compliance**: TypeScript strict mode ve lint kuralları uyumluluğu (✅ YENİ)
- **API Proxy System**: GitHub raw içeriği için proxy endpoint'leri (✅ YENİ)
- **DOM Utilities**: setBlur ve diğer DOM manipulation helpers (✅ YENİ)
- **Context Separation**: React Fast Refresh uyumluluğu için context ayrımı (✅ YENİ)

### ⚠️ Kritik Eksiklikler

- **History Feature**: Geliştirme aşaması (✅ API entegrasyonu tamamlandı)
- **Theme Feature**: Temel slice mevcut, UI geliştirme gerekli
- **Utils**: Temel LQIP utilities mevcut

### 🔄 History Feature - Geliştirme Aşamasında

- ✅ API entegrasyonu tamamlandı (getHistory, getEmptyHistory)
- ✅ AccountPage entegrasyonu tamamlandı
- 🔄 History slice oluşturulması
- 🔄 Sipariş geçmişi UI bileşenleri

### ✅ Cart Feature - TAMAMLANDı

- ✅ Cart modal UI tamamlandı
- ✅ Redux cart slice tamamlandı
- ✅ Sepet ekleme/çıkarma logic
- ✅ Redux Persist entegrasyonu (TAMAMLANDı)
- 🔄 Checkout süreci (gelecek)

### 🎨 Theme Feature

- Dark/Light mode toggle
- Kullanıcı tema tercihleri
- Dinamik renk sistemi

### 🔧 Utils & Hooks

- ✅ useDebounce hook tamamlandı
- ✅ useSkeletonTheme hook tamamlandı
- 🔄 Utility functions
- 🔄 API helpers

### 🌐 Backend Entegrasyonu

- ✅ REST API bağlantısı (RTK Query ile hazır)
- ✅ API endpoint'leri tanımlı
- ✅ API response tip güvenliği (YENİ)
- ✅ API hata işleme (YENİ)
- 🔄 Gerçek backend bağlantısı
- 🔄 Kullanıcı authentication

## 📊 Proje Durumu - ✅ GÜNCEL

### ✅ Tamamlanan Özellikler:

- **Redux Toolkit Store**: Tam konfigürasyon
- **RTK Query API**: Endpoint'ler ve hooks
- **Products Slice**: EntityAdapter ile state management
- **Cart System**: Tam sepet sistemi (slice + UI)
- **Redux Persist**: State persistence (✅ TAMAMLANDı)
- **React Router DOM**: Modern routing entegrasyonu
- **Modal System**: Genel modal bileşeni
- **Search Bar**: Arama overlay'i + debounce
- **API Integration**: RTK Query ile API entegrasyonu (✅ YENİ)
- **Error Handling**: API hata yakalama ve gösterme (✅ YENİ)
- **NoResultsFound**: Arama sonucu bulunamadığında gösterilen bileşen
- **Skeleton Loading**: React Loading Skeleton entegrasyonu (✅ YENİ)
- **Lazy Loading**: Code splitting ve performance optimizasyonu (✅ YENİ)
- **Virtualization**: React Window ile performans optimizasyonu (✅ YENİ)
- **Custom Hooks**: useDebounce hook
- **TypeScript Integration**: Tam tip güvenliği
- **CSS Modules**: Modüler stil sistemi
- **Advanced Skeleton System**: ItemPageSkeleton, TabBarSkeleton, HeaderSkeleton (✅ YENİ)
- **Skeleton Theme Hook**: useSkeletonTheme hook (✅ YENİ)
- **TON Connect Integration**: Blockchain cüzdan bağlantısı ve ödeme sistemi (✅ TAMAMLANDı)
- **CSP Optimization**: Content Security Policy optimizasyonu ve Vercel uyumluluğu (✅ YENİ)
- **ESLint Compliance**: TypeScript strict mode ve lint kuralları uyumluluğu (✅ YENİ)
- **API Proxy System**: GitHub raw içeriği için proxy endpoint'leri (✅ YENİ)
- **DOM Utilities**: setBlur ve diğer DOM manipulation helpers (✅ YENİ)
- **Context Separation**: React Fast Refresh uyumluluğu için context ayrımı (✅ YENİ)

### ⚠️ Kritik Sorunlar:

- **History UI Slice**: Geliştirme aşamasında (API entegrasyonu tamamlandı)
- **Theme Slice**: Temel slice mevcut, UI geliştirme gerekli
- **Utils**: Temel LQIP utilities mevcut

### 🔄 Devam Eden Geliştirmeler:

- **History UI**: Sipariş geçmişi UI bileşenleri
- **Theme Slice**: Tema yönetimi
- **Animation System**: Geçiş animasyonları
- **Checkout Process**: Ödeme süreci

### 📈 Kod Metrikleri - ✅ GÜNCEL:

- **Toplam Satır:** ~7,200+ satır - ✅ GÜNCEL
- **Component Sayısı:** 60+ bileşen - ✅ GÜNCEL
- **Feature Modülü:** 6 modül (1 geliştirme aşamasında) - ✅ GÜNCEL
- **Custom Hook:** 2 aktif hook (useDebounce, useSkeletonTheme)
- **Test Coverage:** Başlangıç seviyesi (1 test dosyası)
- **Bundle Size:** Optimize edilmiş (lazy loading ile)
- **Font Integration:** SF Pro Rounded font ailesi (✅ YENİ)
- **Error Handling:** API hata yönetimi ve boş durum bileşenleri (✅ YENİ)
- **TON Connect Integration:** Tam blockchain entegrasyonu (✅ TAMAMLANDı)

## 🚨 Acil Yapılması Gerekenler

1. **History UI Geliştirme**: Sipariş geçmişi slice ve UI bileşenlerinin tamamlanması

2. **Theme Feature UI Geliştirme**: Mevcut slice'a UI bileşenlerinin eklenmesi

3. **Utils Klasörü Genişletme**: Daha fazla utility fonksiyonunun eklenmesi

## 🔒 CSP ve Deployment Optimizasyonu - ✅ YENİ

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
          "value": "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://not-contest-cdn.openbuilders.xyz https://telegram.org https://*.telegram-cdn.org; connect-src 'self' https://api.telegram.org https://not-contest-cdn.openbuilders.xyz https://raw.githubusercontent.com; frame-ancestors https://t.me; font-src 'self' data:;"
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

### 🌐 API Proxy System

GitHub raw içeriği için Vercel Edge Functions:

```typescript
// api/wallets.ts - TON Connect wallet listesi proxy
export default async function handler(request: VercelRequest, response: VercelResponse) {
  const res = await fetch(
    'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json'
  );
  response.setHeader('Cache-Control', 's-maxage=86400');
  response.status(200).send(await res.text());
}
```

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
