/******************************************************************************
 * File: TonConnectProvider.tsx
 * Layer: feature
 * Desc: TON Connect provider with modal styling and DOM observation for wallet integration
 ******************************************************************************/

import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { TonConnectUI } from '@tonconnect/ui';
import type { Locales } from '@tonconnect/ui';
import { MANIFEST_URL, TON_CONNECT_UI_CONFIG, WALLETS_LIST_URL } from './config';
import { TonConnectUIContext } from './TonConnectContext';

/**
 * Helper function that applies blur effect to HTMLElement
 * Sets background color and backdrop filter with WebKit prefix support
 * @param el - HTML element to apply blur effect to
 * @param color - Background color for the blur effect (default: semi-transparent black)
 */
function setBlur(el: HTMLElement, color: string = 'rgba(0, 0, 0, 0.7)'): void {
  el.style.backgroundColor = color;
  el.style.backdropFilter = 'blur(8px)';

  // Type extension for WebKit prefix
  const css = el.style as CSSStyleDeclaration & { webkitBackdropFilter?: string };
  css.webkitBackdropFilter = 'blur(8px)';
}

interface TonConnectProviderProps {
  children: ReactNode;
}

/**
 * Create provider using TonConnectUI class
 * @tonconnect/ui doesn't directly export TonConnectUIProvider
 */
const tonConnectUI = new TonConnectUI({
  manifestUrl: MANIFEST_URL,
  uiPreferences: TON_CONNECT_UI_CONFIG.uiPreferences,
  language: TON_CONNECT_UI_CONFIG.language as Locales,
});

/**
 * Manually override TON Connect walletsList URL
 * Use our own proxy API for wallets list
 */
// @ts-expect-error walletsListSource not in SDK definition, available at runtime
if (tonConnectUI.connector && tonConnectUI.connector.walletsList) {
  // @ts-expect-error walletsListSource not in SDK definition, available at runtime
  tonConnectUI.connector.walletsList.walletsListSource = WALLETS_LIST_URL;
}

/**
 * Add dynamic styles for TON Connect modal blur effect
 * Prevents duplicate style injection
 */
const addTonConnectModalStyles = () => {
  // Don't add if styles already exist
  if (document.getElementById('ton-connect-modal-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'ton-connect-modal-styles';
  style.textContent = `
    /* TON Connect Modal Blur Effect - Exact copy of cart modal blur structure */
    tc-modal,
    tc-modal-backdrop,
    .tc-modal,
    .tc-modal-backdrop,
    .tonconnect-modal,
    .tonconnect-modal-backdrop,
    .tonconnect-ui-modal,
    .tonconnect-ui-modal-backdrop,
    [data-tc-modal],
    [data-tc-modal-backdrop],
    [data-tonconnect-modal],
    [data-tonconnect-modal-backdrop],
    div[class*="modal"][class*="backdrop"],
    div[class*="tonconnect"][class*="backdrop"],
    div[class*="tc-"][class*="backdrop"] {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background-color: rgba(0, 0, 0, 0.7) !important;
      backdrop-filter: blur(8px) !important;
      -webkit-backdrop-filter: blur(8px) !important;
      z-index: 1000 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: flex-end !important;
    }

    /* Target modal backdrops created with inline styles */
    body > div[style*="position: fixed"][style*="z-index"],
    #root ~ div[style*="position: fixed"][style*="z-index"],
    div[style*="position: fixed"][style*="top: 0"][style*="left: 0"] {
      background-color: rgba(0, 0, 0, 0.7) !important;
      backdrop-filter: blur(8px) !important;
      -webkit-backdrop-filter: blur(8px) !important;
    }
  `;

  document.head.appendChild(style);
};

/**
 * Observe DOM changes with MutationObserver and apply styles when modal opens
 * Monitors for TON Connect modal elements and applies blur effects
 * @returns MutationObserver instance for cleanup
 */
const observeTonConnectModal = () => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;

          // Check for TON Connect modal elements
          if (
            element.tagName?.toLowerCase().includes('tc-') ||
            element.className?.includes('tonconnect') ||
            element.className?.includes('tc-') ||
            element.getAttribute('data-tc-modal') ||
            element.getAttribute('data-tonconnect-modal') ||
            (element.getAttribute('style')?.includes('position: fixed') &&
              element.getAttribute('style')?.includes('z-index'))
          ) {
            // Apply blur effect to modal backdrop
            const backdrop =
              element.querySelector('[class*="backdrop"], [data-backdrop]') || element;
            if (backdrop instanceof HTMLElement) {
              setBlur(backdrop);
            }
          }
        }
      });
    });
  });

  // Only observe root where modal is added
  const root = document.querySelector('#tc-modal-root') ?? document.body;
  observer.observe(root, {
    childList: true,
    subtree: true,
  });

  return observer;
};

/**
 * TON Connect provider component
 * Sets up modal styling and DOM observation for wallet integration
 * @param children - Child components to wrap with TON Connect context
 * @returns JSX element containing TON Connect context provider
 */
const TonConnectProvider: React.FC<TonConnectProviderProps> = ({ children }) => {
  useEffect(() => {
    // Add dynamic styles
    addTonConnectModalStyles();

    // Observe DOM changes
    const observer = observeTonConnectModal();

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <TonConnectUIContext.Provider value={tonConnectUI}>{children}</TonConnectUIContext.Provider>
  );
};

export default TonConnectProvider;
