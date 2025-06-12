/******************************************************************************
 * File: TonConnectContext.ts
 * Layer: feature
 * Desc: React context for TON Connect UI instance sharing across components
 ******************************************************************************/

import { createContext } from 'react';
import { TonConnectUI } from '@tonconnect/ui';

/**
 * React context for TON Connect UI instance
 * Initially null, actual value will be assigned in Provider
 */
export const TonConnectUIContext = createContext<TonConnectUI>(null as unknown as TonConnectUI);
