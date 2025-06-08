import type { Theme } from '@tonconnect/ui';

// TON Connect configuration
export const CHAIN = {
  name: 'TON Mainnet',
  chainId: 1
};

// App manifest URL - kendi manifestimizi kullanıyoruz
export const MANIFEST_URL = '/tonconnect-manifest.json';

// Optional TON Connect UI configuration
export const TON_CONNECT_UI_CONFIG = {
  language: 'en',
  uiPreferences: {
    theme: 'LIGHT' as Theme // Beyaz tema kullanıyoruz
  }
}; 