/******************************************************************************
 * File: config.ts
 * Layer: feature
 * Desc: TON Connect configuration settings and API endpoints
 ******************************************************************************/

import type { Theme } from '@tonconnect/ui';

/**
 * TON blockchain configuration
 */
export const CHAIN = {
  name: 'TON Mainnet',
  chainId: 1,
};

/**
 * App manifest URL - using our own manifest
 */
export const MANIFEST_URL = '/tonconnect-manifest.json';

/**
 * Wallets list using our own proxy API
 */
export const WALLETS_LIST_URL = '/api/wallets';

/**
 * Optional TON Connect UI configuration
 * Sets language and theme preferences
 */
export const TON_CONNECT_UI_CONFIG = {
  language: 'en',
  uiPreferences: {
    theme: 'LIGHT' as Theme, // Using light theme
  },
};
