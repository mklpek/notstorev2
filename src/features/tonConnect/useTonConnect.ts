/******************************************************************************
 * File: useTonConnect.ts
 * Layer: feature
 * Desc: TON Connect hook for blockchain wallet integration and transaction management
 ******************************************************************************/

import { useContext } from 'react';
import { TonConnectUIContext } from './TonConnectContext';

/**
 * Custom hook for TON Connect wallet integration
 * Provides wallet connection, transaction sending, and modal management
 * @returns Object containing TON Connect UI methods and state
 */
const useTonConnect = () => {
  const tonConnectUI = useContext(TonConnectUIContext);

  // Export necessary functions from TonConnectUI
  return {
    tonConnectUI,
    isConnected: tonConnectUI.connected,
    wallet: tonConnectUI.wallet,
    openModal: () => tonConnectUI.openModal(),
    closeModal: () => tonConnectUI.closeModal(),
    disconnect: () => tonConnectUI.disconnect(),
    // Send transaction method - for advanced use cases
    sendTransaction: tonConnectUI.sendTransaction.bind(tonConnectUI),
  };
};

export default useTonConnect;
