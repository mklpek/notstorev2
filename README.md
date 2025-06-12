# Not Store – Telegram Mini App

[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mikailipek/contest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.8.2-764ABC?logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white)
![TON Connect](https://img.shields.io/badge/TON_Connect-2.1.0-0088CC?logo=telegram&logoColor=white)

## TL;DR

Not Store, Telegram Mini App platformu için geliştirilmiş modern bir e-ticaret uygulamasıdır. RTK Query cache + TON Connect + BlurHash teknolojileri ile optimize edilmiş performans sunar. Figma tasarımından birebir kopyalanmış UI ve blockchain ödeme sistemi ile tam özellikli alışveriş deneyimi sağlar.

## Live Demo

**🚀 Live Mini-App:** https://t.me/not_store_bot/APP  
**📱 Source Code:** https://github.com/mikailipek/contest  
**🎨 Figma Design:** https://www.figma.com/design/CNyDh8dajidImm7mGiM0yL/Untitled?node-id=1-7892&t=c4ro1yHNezpapz6M-4

_Demo: store browsing → add to cart → TON Connect purchase_

## Stack

React 19 • Vite 6 • Redux Toolkit 2 • RTK Query • TON Connect UI React

## Features

- **🎨 Figma Perfect Match**: Pixel-perfect implementation from Figma design
- **🛒 Complete Cart System**: Redux-powered cart with persistence
- **🔗 TON Connect Integration**: Blockchain wallet connection & payments
- **⚡ Performance Optimized**: Skeleton loading, code splitting, virtualization
- **📱 Telegram WebApp 2.0**: Modern Bot API 8+ integration with safe area support
- **🔍 Advanced Search**: Debounced search with real-time filtering
- **🖼️ Progressive Images**: BlurHash placeholders with optimized loading
- **🎯 Type Safety**: Full TypeScript integration with strict mode
- **🔄 State Management**: Redux Toolkit with RTK Query for API caching
- **📐 Responsive Design**: Mobile-first 390px optimized layout

## Quick Start

### Prerequisites

- Node.js ≥ 20.0.0
- pnpm ≥ 9.0.0
- Telegram BOT_TOKEN (from @BotFather)

### Installation & Setup

```bash
# Clone repository
git clone https://github.com/mikailipek/contest.git
cd contest

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Fill: BOT_TOKEN, VITE_BOT_USERNAME, TON_APP_ENV

# Start development server
pnpm dev  # http://localhost:5173
```

### Available Scripts

| Script         | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start development server |
| `pnpm build`   | Build for production     |
| `pnpm lint`    | Run ESLint               |
| `pnpm preview` | Preview production build |
| `pnpm prepare` | Setup Husky hooks        |

## Environment Variables

| Variable            | Purpose                            | Example         | Required |
| ------------------- | ---------------------------------- | --------------- | -------- |
| `BOT_TOKEN`         | Telegram bot token from @BotFather | `123456:ABC...` | ✅       |
| `VITE_BOT_USERNAME` | Bot username for WebApp SDK        | `not_store_bot` | ✅       |
| `TON_APP_ENV`       | TON Connect environment            | `testnet`       | ❌       |
| `NODE_ENV`          | Build environment                  | `production`    | ❌       |

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mikailipek/contest)

### Custom CSP Headers

Our `vercel.json` includes optimized Content Security Policy for Telegram Mini Apps:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' data: https://not-contest-cdn.openbuilders.xyz; connect-src 'self' https://api.telegram.org; frame-ancestors https://t.me;"
        }
      ]
    }
  ]
}
```

Each directive ensures:

- `default-src 'self'`: Restrict to same origin
- `img-src`: Allow product images from CDN
- `connect-src`: Allow API calls to Telegram
- `frame-ancestors`: Allow embedding in Telegram

## API Reference

| Method | Endpoint               | Description           | Response     |
| ------ | ---------------------- | --------------------- | ------------ |
| `GET`  | `/api/items.json`      | Product catalogue     | `Item[]`     |
| `GET`  | `/api/history.json`    | Purchase history      | `Purchase[]` |
| `GET`  | `/api/no_history.json` | Empty history state   | `Purchase[]` |
| `GET`  | `/api/wallets.ts`      | TON wallet list proxy | `Wallet[]`   |

### RTK Query Integration

```typescript
// Auto-generated hooks
const { data, error, isLoading } = useGetCatalogueQuery();
const { data: history } = useGetHistoryQuery();
```

Error handling with `transformResponse` guard for type safety.

## BotFather Setup

1. **Create Bot**

   ```
   /newbot
   Bot Name: Not Store
   Username: not_store_bot
   ```

2. **Set Domain**

   ```
   /setdomain
   Domain: https://<your-vercel-app>.vercel.app
   ```

3. **Configure Menu Button**

   ```
   /setmenubutton
   URL: https://t.me/not_store_bot/APP
   Text: 🛍️ Open Store
   ```

4. **Set Description**
   ```
   /setdescription
   Modern e-commerce Mini App with TON Connect integration
   ```

For detailed Telegram WebApp setup, see [Telegram WebApp Documentation](https://core.telegram.org/bots/webapps).

## Performance & Accessibility

### Optimization Strategies

- **Skeleton Loading**: React Loading Skeleton with theme integration
- **Code Splitting**: React.lazy() + Suspense for route-based splitting
- **Virtualization**: React Window for large product lists
- **Image Optimization**: BlurHash placeholders + Progressive loading
- **Bundle Optimization**: Vite + Terser minification

### Accessibility Testing

- **WAVE**: Web Accessibility Evaluation Tool - ✅ Passed
- **Axe DevTools**: Automated accessibility testing - ✅ No violations
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader**: ARIA labels and semantic HTML structure

### Performance Metrics

- **Lighthouse Score**: 95+ Performance, 100 Accessibility
- **Bundle Size**: <500KB gzipped
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <2.5s

## Contribution

We follow [Conventional Commits](https://conventionalcommits.org/) for commit messages:

```bash
feat: add new product filter functionality
fix: resolve cart quantity update bug
docs: update API documentation
style: format code with prettier
refactor: optimize Redux selectors
test: add cart slice unit tests
```

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

MIT

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
