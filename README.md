# Not Store – Telegram Mini App E-commerce Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/not-store)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TON](https://img.shields.io/badge/TON-0088CC?logo=telegram&logoColor=white)](https://ton.org/)

## 🎯 TL;DR

**Not Store** revolutionizes e-commerce by seamlessly integrating blockchain payments into the familiar Telegram ecosystem. Built with cutting-edge React 19 and Redux Toolkit 2, it features advanced RTK Query caching, TON Connect blockchain integration, and progressive image loading with blur placeholders for lightning-fast user experiences. The app includes a delightful Easter egg: dynamic theme switching that adapts to user preferences and system settings.

## 🚀 Live Demo

**🤖 Try the Bot:** [https://t.me/not_store_bot/APP](https://t.me/not_store_bot/APP)  
**📱 Web Version:** [https://notstore-contest.vercel.app](https://notstore-contest.vercel.app)  
**💻 Source Code:** [https://github.com/username/not-store](https://github.com/username/not-store)

> 🎬 **Demo GIF:** _[5-second demonstration of store browsing → cart → TON payment flow]_

## 🛠 Tech Stack

**Frontend:** React 19 • TypeScript • Vite 6  
**State Management:** Redux Toolkit 2 • RTK Query • Redux Persist  
**Blockchain:** TON Connect UI React • TON SDK  
**Styling:** CSS Modules • CSS Custom Properties • Mobile-First Design  
**Performance:** React Loading Skeleton • Progressive Images • LQIP • React.memo  
**Deployment:** Vercel Edge Functions • CSP Headers  
**Development:** ESLint • Prettier • TypeScript Strict Mode • pnpm

## ✨ Features

1. 🛍️ **Smart Product Catalog** - Real-time search with debounced queries and infinite scroll
2. 🛒 **Persistent Shopping Cart** - Redux-powered cart with local storage persistence
3. 💎 **TON Blockchain Payments** - Seamless cryptocurrency transactions via TON Connect
4. 👤 **User Account System** - Profile management with comprehensive purchase history
5. 🖼️ **Progressive Image Loading** - LQIP (Low Quality Image Placeholders) with blur-to-sharp transitions
6. ⚡ **Skeleton Loading States** - Optimized loading experiences with memoized components
7. 📱 **Mobile-First Responsive Design** - Telegram WebApp optimized with safe area support
8. 🎨 **Dynamic Theme System** - Light/Dark/System preference with smooth transitions
9. ♿ **Accessibility Features** - ARIA labels, keyboard navigation, screen reader support
10. 🔒 **Security Implementation** - Content Security Policy with nonce-based script execution

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.0.0
- **pnpm** ≥ 9.0.0
- **Telegram Bot Token** (from [@BotFather](https://t.me/BotFather))

### Installation

```bash
# Clone the repository
git clone https://github.com/username/not-store.git
cd not-store

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
pnpm dev
```

Your app will be available at `http://localhost:5173`

## 🔧 Environment Variables

| Variable            | Purpose                                 | Example                      | Required |
| ------------------- | --------------------------------------- | ---------------------------- | -------- |
| `BOT_TOKEN`         | Telegram Bot API token from @BotFather  | `123456:ABC-DEF...`          | ✅       |
| `VITE_BOT_USERNAME` | Bot username for WebApp SDK integration | `not_store_bot`              | ✅       |
| `TON_APP_ENV`       | TON Connect environment configuration   | `testnet`                    | ✅       |
| `VITE_APP_URL`      | Application URL for Telegram WebApp     | `https://yourapp.vercel.app` | ✅       |

## 📜 Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `pnpm dev`        | Start development server with hot reload |
| `pnpm build`      | Build optimized production bundle        |
| `pnpm preview`    | Preview production build locally         |
| `pnpm lint`       | Run ESLint code analysis                 |
| `pnpm lint:fix`   | Auto-fix ESLint issues                   |
| `pnpm type-check` | Run TypeScript type checking             |
| `pnpm clean`      | Clean build artifacts and node_modules   |

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/not-store)

1. Click the deploy button above
2. Configure environment variables in Vercel dashboard
3. Your app will be deployed automatically

### Manual Deployment

```bash
# Build for production
pnpm build

# Deploy to your preferred platform
# The dist/ folder contains the built application
```

### Content Security Policy

Our CSP implementation includes:

```javascript
// vercel.json CSP configuration
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'nonce-{NONCE}' https://telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.telegram.org https://ton.org;"
```

## 📡 API Reference

| Method | Route                  | Description                  | RTK Query Hook         | Cache Time |
| ------ | ---------------------- | ---------------------------- | ---------------------- | ---------- |
| `GET`  | `/api/items.json`      | Product catalog with search  | `useGetItemsQuery`     | 5 min      |
| `GET`  | `/api/history.json`    | User purchase history        | `useGetHistoryQuery`   | 1 min      |
| `GET`  | `/api/no_history.json` | Empty state placeholder data | `useGetNoHistoryQuery` | 10 min     |
| `GET`  | `/api/wallets.ts`      | TON Connect wallet list      | `useGetWalletsQuery`   | 1 hour     |

### RTK Query Implementation

```typescript
// Example: Product catalog API
export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Items'],
  endpoints: builder => ({
    getItems: builder.query<Item[], void>({
      query: () => 'items.json',
      providesTags: ['Items'],
      transformResponse: (response: unknown) => {
        // Type-safe response transformation
        return validateItemsResponse(response);
      },
    }),
  }),
});
```

## 🤖 BotFather Setup

### Step-by-Step Configuration

1. **Create Your Bot**

   ```
   /newbot
   Choose a name: Not Store Bot
   Choose a username: not_store_bot
   ```

2. **Get Your Token**

   ```
   Copy the token and add to .env as BOT_TOKEN
   ```

3. **Set Domain**

   ```
   /setdomain
   Select your bot
   Enter: https://yourapp.vercel.app
   ```

4. **Configure Menu Button**

   ```
   /setmenubutton
   Select your bot
   Enter button text: 🛍️ Open Store
   Enter Web App URL: https://yourapp.vercel.app
   ```

5. **Set Description**
   ```
   /setdescription
   Enter: Modern e-commerce platform with TON blockchain payments
   ```

## ⚡ Performance & Accessibility

### Performance Optimizations

- **Skeleton Loading Strategy**: Memoized skeleton components prevent unnecessary re-renders
- **Progressive Image Loading**: LQIP technique with blur-to-sharp transitions
- **Code Splitting**: Route-based lazy loading with React.lazy()
- **RTK Query Caching**: Intelligent data caching with automatic invalidation
- **React.memo**: Strategic component memoization for expensive renders

### Accessibility Features

- **ARIA Labels**: Comprehensive screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling in modals and navigation
- **Color Contrast**: WCAG AA compliant color schemes
- **Semantic HTML**: Proper heading hierarchy and landmark roles

**Accessibility Testing**: Validated with [WAVE Web Accessibility Evaluator](https://wave.webaim.org/) and [axe DevTools](https://www.deque.com/axe/devtools/).

## 📁 Project Structure

```
not-store/
├── src/
│   ├── core/                 # Core utilities and shared components
│   │   ├── api/             # API configurations and helpers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Redux store configuration
│   │   ├── styles/          # Global styles and theme
│   │   ├── ui/              # Reusable UI components
│   │   └── utils/           # Utility functions
│   ├── features/            # Feature-based modules
│   │   ├── account/         # User account management
│   │   ├── cart/            # Shopping cart functionality
│   │   ├── catalogue/       # Product catalog
│   │   ├── checkout/        # Checkout process
│   │   ├── search/          # Search functionality
│   │   ├── theme/           # Theme management
│   │   └── tonConnect/      # TON blockchain integration
│   ├── layout/              # Layout components
│   │   ├── Footer/          # App footer
│   │   ├── Header/          # App header with search
│   │   ├── MainLayout/      # Main layout wrapper
│   │   └── TabBar/          # Bottom navigation
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── api/                     # Vercel Edge Functions
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── vercel.json              # Vercel deployment configuration
└── README.md                # This file
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** using [Conventional Commits](https://conventionalcommits.org/):
   ```
   feat: add TON payment integration
   fix: resolve cart persistence issue
   docs: update API documentation
   ```
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Automatic code formatting
- **Testing**: Jest + React Testing Library (coming soon)

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2024 Not Store Team
Permission is hereby granted, free of charge, to any person obtaining a copy...
```

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

**Latest Release**: v1.0.0 - Initial contest submission

## 🆘 Troubleshooting

### Common Issues

**CSP Errors in Browser Console**

```
Solution: Ensure your Vercel deployment includes the correct CSP headers
Check: vercel.json configuration matches our template
```

**TON Connect Not Loading**

```
Solution: Verify TON_APP_ENV is set correctly in environment variables
Check: Bot domain is properly configured in @BotFather
```

**Images Not Loading**

```
Solution: Check if image URLs are accessible and CORS-enabled
Check: Progressive image component configuration
```

## 🙏 Acknowledgements

- **[TON Foundation](https://ton.org/)** - Blockchain infrastructure and documentation
- **[Redux Toolkit](https://redux-toolkit.js.org/)** - State management excellence
- **[React Team](https://react.dev/)** - The foundation of our UI
- **[Vercel](https://vercel.com/)** - Seamless deployment platform
- **[Telegram](https://core.telegram.org/)** - Mini Apps platform and WebApp SDK

---

<div align="center">

**Built with ❤️ for the TON ecosystem**

[🤖 Try the Bot](https://t.me/not_store_bot/APP) • [📱 Web App](https://notstore-contest.vercel.app) • [💻 Source](https://github.com/username/not-store)

</div>
