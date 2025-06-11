import type { Theme } from '@tonconnect/ui';

// TON Connect configuration
export const CHAIN = {
  name: 'TON Mainnet',
  chainId: 1,
};

// App manifest URL - kendi manifestimizi kullanıyoruz
export const MANIFEST_URL = '/tonconnect-manifest.json';

// Wallets listesi için ana ve yedek kaynaklar
// CSP izinleri eklendi, artık direkt GitHub'dan çekebiliriz
export const WALLETS_LIST_URL =
  'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json';

// Yedek olarak kendi proxy API'mizi kullan
export const FALLBACK_WALLETS_LIST_URL = '/api/wallets';

// Optional TON Connect UI configuration
export const TON_CONNECT_UI_CONFIG = {
  language: 'en',
  uiPreferences: {
    theme: 'LIGHT' as Theme, // Beyaz tema kullanıyoruz
  },
};
