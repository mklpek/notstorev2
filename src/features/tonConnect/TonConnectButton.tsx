/******************************************************************************
 * File: TonConnectButton.tsx
 * Layer: feature
 * Desc: TON Connect wallet connection button with dynamic state display
 ******************************************************************************/

import React from 'react';
import useTonConnect from './useTonConnect';
import styles from './TonConnectButton.module.css';

interface TonConnectButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * TON Connect wallet connection button component
 * Displays connection status and handles wallet connection/disconnection
 * @param className - Optional CSS class for styling
 * @param style - Optional inline styles
 * @returns JSX element containing wallet connection button
 */
const TonConnectButton: React.FC<TonConnectButtonProps> = ({ className = '', style }) => {
  const { openModal, isConnected, wallet, disconnect } = useTonConnect();

  /**
   * Handles button click events
   * Disconnects if connected, opens connection modal if not connected
   */
  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      openModal();
    }
  };

  /**
   * Gets wallet information for display
   * Safely extracts wallet name from wallet object
   * @returns Wallet name or fallback text
   */
  const getWalletInfo = () => {
    if (!wallet) return 'Wallet';

    // wallet.name property may not be directly available
    // so we use any type for safe access
    const walletAny = wallet as any;
    return walletAny.name || walletAny.connectItems?.name || 'Wallet';
  };

  return (
    <button
      className={`${styles.tonConnectButton} ${className}`}
      onClick={handleClick}
      style={style}
    >
      {isConnected ? `${getWalletInfo()} Connected` : 'Connect Wallet'}
    </button>
  );
};

export default TonConnectButton;
