import React, { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { TonConnectUI } from '@tonconnect/ui';
import type { Locales } from '@tonconnect/ui';
import { MANIFEST_URL, TON_CONNECT_UI_CONFIG } from './config';
import { TonConnectUIContext } from './TonConnectContext';
import { setBlur } from './utils/dom';

interface TonConnectProviderProps {
  children: ReactNode;
}

// TON Connect walletsList URL'sini çalışma zamanında ayarla
// Bu şekilde window.location'a build zamanında değil, çalışma zamanında erişiyoruz
const getWalletsListUrl = () => {
  return `${window.location.origin}/api/wallets`;
};

// TonConnectUI sınıfını kullanarak provider oluşturacağız
// @tonconnect/ui, TonConnectUIProvider doğrudan export etmiyor
const createTonConnectUI = () => {
  try {
    const ui = new TonConnectUI({
      manifestUrl: MANIFEST_URL,
      uiPreferences: TON_CONNECT_UI_CONFIG.uiPreferences,
      language: TON_CONNECT_UI_CONFIG.language as Locales,
    });

    // TON Connect walletsList URL'yi manuel override et
    if (ui.connector) {
      // @ts-expect-error walletsListSource SDK tanımında yok, runtime'da mevcut
      if (ui.connector.walletsList) {
        try {
          // @ts-expect-error walletsListSource SDK tanımında yok, runtime'da mevcut
          ui.connector.walletsList.walletsListSource = getWalletsListUrl();
        } catch (error) {
          console.error('Failed to set wallets list source:', error);
        }
      }
    }

    return ui;
  } catch (error) {
    console.error('Failed to initialize TonConnectUI:', error);
    // Fallback olarak minimal bir TonConnectUI objesi döndür
    return {
      connector: {
        connected: false,
        connect: () => Promise.resolve(),
        disconnect: () => {},
      },
      openModal: () => {},
      closeModal: () => {},
    } as unknown as TonConnectUI;
  }
};

// TON Connect modal blur efekti için dinamik stil ekleme
const addTonConnectModalStyles = () => {
  // Eğer stil zaten eklenmişse tekrar ekleme
  if (document.getElementById('ton-connect-modal-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'ton-connect-modal-styles';
  style.textContent = `
    /* TON Connect Modal Blur Efekti - Sepet modalındaki blur yapısını birebir kopyalama */
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

    /* Inline style ile oluşturulan modal backdrop'ları hedefle */
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

// MutationObserver ile DOM değişikliklerini izle ve modal açıldığında stil uygula
const observeTonConnectModal = () => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;

          // TON Connect modal elementlerini kontrol et
          if (
            element.tagName?.toLowerCase().includes('tc-') ||
            element.className?.includes('tonconnect') ||
            element.className?.includes('tc-') ||
            element.getAttribute('data-tc-modal') ||
            element.getAttribute('data-tonconnect-modal') ||
            (element.getAttribute('style')?.includes('position: fixed') &&
              element.getAttribute('style')?.includes('z-index'))
          ) {
            // Modal backdrop'a blur efekti uygula
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

  // Sadece modal eklendiği root'u izle
  const root = document.querySelector('#tc-modal-root') ?? document.body;
  observer.observe(root, {
    childList: true,
    subtree: true,
  });

  return observer;
};

const TonConnectProvider: React.FC<TonConnectProviderProps> = ({ children }) => {
  // useMemo ile TonConnectUI örneğini oluştur - böylece sadece bir kez yaratılır
  const tonConnectUI = useMemo(() => createTonConnectUI(), []);

  useEffect(() => {
    // Dinamik stil ekle
    addTonConnectModalStyles();

    // DOM değişikliklerini izle
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
