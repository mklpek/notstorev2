# RFC: Code Standardization and English Translation

## Overview

This RFC outlines the standardization process for converting all Turkish code comments, variable names, and documentation to English while implementing a consistent file header format across the entire codebase.

## File Header Standard

Every file should start with this standardized header:

```typescript
/******************************************************************************
 * File: [filename]
 * Layer: [core|feature|layout|api|utils|types]
 * Desc: [Brief description of file purpose and functionality]
 ******************************************************************************/
```

### Layer Definitions:

- **core**: Store, hooks, UI components, styles, utilities
- **feature**: Business logic modules (cart, catalogue, account, etc.)
- **layout**: Layout components (Header, Footer, TabBar, MainLayout)
- **api**: API endpoints and configurations
- **utils**: Utility functions and helpers
- **types**: Type definitions and interfaces

## Comment Translation Rules

### 1. Turkish → English Comment Mapping

| Turkish                | English                  |
| ---------------------- | ------------------------ |
| `// Ana bileşen`       | `// Main component`      |
| `// Sepet durumu`      | `// Cart state`          |
| `// Ürün listesi`      | `// Product list`        |
| `// API çağrısı`       | `// API call`            |
| `// Hata yönetimi`     | `// Error handling`      |
| `// Yükleme durumu`    | `// Loading state`       |
| `// Kullanıcı arayüzü` | `// User interface`      |
| `// Veri dönüşümü`     | `// Data transformation` |
| `// Durum yönetimi`    | `// State management`    |
| `// Olay işleyici`     | `// Event handler`       |

### 2. JSDoc Comment Standards

```typescript
/**
 * Brief description of function/component
 * @param paramName - Parameter description
 * @returns Return value description
 * @example
 * // Usage example
 */
```

### 3. Inline Comment Standards

```typescript
// Single line explanation
/* Multi-line explanation
   for complex logic */
```

## Files to be Updated

### Core Layer (15 files)

#### Store Configuration

1. `src/core/store/store.ts` - Redux store setup with middleware
2. `src/core/store/hooks.ts` - Typed Redux hooks
3. `src/core/store/index.ts` - Store exports

#### API Layer

4. `src/core/api/notApi.ts` - RTK Query API endpoints

#### UI Components

5. `src/core/ui/Icons/BasketIcon.tsx` - Basket icon component
6. `src/core/ui/Icons/CartTagIcon.tsx` - Cart tag icon component
7. `src/core/ui/Icons/DeleteIcon.tsx` - Delete icon component
8. `src/core/ui/Icons/SearchIcon.tsx` - Search icon component
9. `src/core/ui/Icons/ShareIcon.tsx` - Share icon component
10. `src/core/ui/Icons/StoreIcon.tsx` - Store icon component
11. `src/core/ui/Modal/Modal.tsx` - Modal component
12. `src/core/ui/Button/Button.tsx` - Button component
13. `src/core/ui/ApiErrorMessage.tsx` - API error message component
14. `src/core/ui/EmptyState.tsx` - Empty state component
15. `src/core/ui/Form.tsx` - Form component

#### Skeleton Components (10 files)

16. `src/core/ui/Skeleton/AppSkeleton.tsx` - App skeleton component
17. `src/core/ui/Skeleton/ItemPageSkeleton.tsx` - Item page skeleton
18. `src/core/ui/Skeleton/ProductCardSkeleton.tsx` - Product card skeleton
19. `src/core/ui/Skeleton/TabBarSkeleton.tsx` - TabBar skeleton
20. `src/core/ui/Skeleton/HeaderSkeleton.tsx` - Header skeleton
21. `src/core/ui/Skeleton/AccountPageSkeleton.tsx` - Account page skeleton
22. `src/core/ui/Skeleton/SkeletonElements.tsx` - Reusable skeleton elements

#### Progressive Image

23. `src/core/ui/ProgressiveImage/ProgressiveImage.tsx` - Progressive image loading

#### Custom Hooks

24. `src/core/hooks/useDebounce.ts` - Debounce hook
25. `src/core/hooks/useSkeletonTheme.ts` - Skeleton theme hook
26. `src/core/hooks/useTelegramHeader.ts` - Telegram header management
27. `src/core/hooks/useSafeArea.tsx` - Safe area management

#### Utilities

28. `src/utils/lqip.ts` - Low Quality Image Placeholder utilities
29. `src/utils/telegramHelpers.ts` - Telegram WebApp helpers

### Feature Layer (25 files)

#### Account Feature

30. `src/features/account/AccountPage.tsx` - Account page component
31. `src/features/account/api.ts` - Account API functions

#### Cart Feature

32. `src/features/cart/CartModal.tsx` - Cart modal component
33. `src/features/cart/cartSlice.ts` - Redux cart slice
34. `src/features/cart/cartPersist.ts` - Persist configuration
35. `src/features/cart/selectors.ts` - Cart selectors
36. `src/features/cart/types.ts` - Cart TypeScript types

#### Catalogue Feature

37. `src/features/catalogue/components/ImageGallery.tsx` - Image gallery component
38. `src/features/catalogue/components/ItemPage.tsx` - Item page component
39. `src/features/catalogue/components/NoResultsFound.tsx` - No results component
40. `src/features/catalogue/components/ProductCard.tsx` - Product card component
41. `src/features/catalogue/components/ProductGrid.tsx` - Product grid component
42. `src/features/catalogue/ProductGrid.tsx` - Main product grid
43. `src/features/catalogue/api.ts` - Products API functions
44. `src/features/catalogue/types.ts` - TypeScript types

#### Search Feature

45. `src/features/search/SearchBar.tsx` - Search bar component

#### TON Connect Feature

46. `src/features/tonConnect/TonConnectProvider.tsx` - TON Connect provider
47. `src/features/tonConnect/TonConnectContext.ts` - TON Connect context
48. `src/features/tonConnect/TonConnectButton.tsx` - TON Connect button
49. `src/features/tonConnect/SuccessModal.tsx` - Success modal
50. `src/features/tonConnect/useTonConnect.ts` - TON Connect hook
51. `src/features/tonConnect/buyNow.ts` - Buy now utilities
52. `src/features/tonConnect/config.ts` - TON Connect configuration
53. `src/features/tonConnect/utils/dom.ts` - DOM utilities

#### Theme Feature

54. `src/features/theme/themeSlice.ts` - Theme slice

### Layout Layer (8 files)

55. `src/layouts/Header/Header.tsx` - Header component
56. `src/layouts/Footer/Footer.tsx` - Footer component
57. `src/layouts/TabBar/TabBar.tsx` - TabBar component
58. `src/layouts/MainLayout.tsx` - Main layout component

### API Layer (1 file)

59. `api/wallets.ts` - Vercel Edge Function for TON wallets

### Main Application Files (2 files)

60. `src/App.tsx` - Main application component
61. `src/main.tsx` - Application entry point

### Type Definition Files (2 files)

62. `src/types.d.ts` - Global type definitions
63. `src/vite-env.d.ts` - Vite environment types

## Implementation Process

### Phase 1: Core Layer (Files 1-29)

- Update store configuration files
- Translate API layer comments
- Standardize UI component headers
- Update skeleton component documentation
- Translate custom hooks

### Phase 2: Feature Layer (Files 30-54)

- Update account feature
- Translate cart feature comments
- Standardize catalogue feature
- Update search functionality
- Translate TON Connect integration
- Update theme feature

### Phase 3: Layout Layer (Files 55-58)

- Translate layout components
- Update layout documentation

### Phase 4: API & Main Files (Files 59-63)

- Update API endpoints
- Translate main application files
- Update type definitions

## Quality Assurance

### Checklist for Each File:

- [ ] File header added with correct layer and description
- [ ] All Turkish comments translated to English
- [ ] JSDoc comments added for functions/components
- [ ] Inline comments follow standard format
- [ ] Variable names are descriptive and in English
- [ ] Function names follow camelCase convention
- [ ] Component names follow PascalCase convention
- [ ] Type definitions are clear and documented

### Code Review Points:

1. **Consistency**: All files follow the same header format
2. **Clarity**: Comments explain the "why" not just the "what"
3. **Completeness**: All public functions have JSDoc comments
4. **Accuracy**: Translations maintain original meaning
5. **Standards**: Code follows TypeScript and React best practices

## Example Transformations

### Before (Turkish):

```typescript
// Sepet durumunu yöneten slice
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Ürün ekleme
    addItem: (state, action) => {
      // Mevcut ürün kontrolü
      const existingItem = state.entities[action.payload.id];
      if (existingItem) {
        // Miktarı artır
        existingItem.quantity += 1;
      }
    },
  },
});
```

### After (English):

```typescript
/******************************************************************************
 * File: cartSlice.ts
 * Layer: feature
 * Desc: Normalized cart state management with reducers and selectors
 ******************************************************************************/

/**
 * Cart slice managing shopping cart state
 * Uses EntityAdapter for normalized state structure
 */
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add item to cart or increment quantity if exists
     * @param state - Current cart state
     * @param action - Action with item payload
     */
    addItem: (state, action) => {
      // Check if item already exists in cart
      const existingItem = state.entities[action.payload.id];
      if (existingItem) {
        // Increment quantity for existing item
        existingItem.quantity += 1;
      }
    },
  },
});
```

## Timeline

- **Week 1**: Phase 1 (Core Layer) - 29 files
- **Week 2**: Phase 2 (Feature Layer) - 25 files
- **Week 3**: Phase 3 & 4 (Layout, API, Main) - 9 files
- **Week 4**: Quality assurance and final review

## Success Criteria

1. All 63 files have standardized headers
2. Zero Turkish comments remain in codebase
3. All public functions have JSDoc documentation
4. Code passes ESLint checks
5. Build process completes without warnings
6. All tests pass after refactoring

---

**Note**: This RFC serves as a comprehensive guide for the code standardization process. Each file should be updated according to these guidelines to ensure consistency and maintainability across the entire codebase.
