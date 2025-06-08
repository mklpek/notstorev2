import React from 'react';
import useTonConnect from './useTonConnect';
import styles from './TonConnectButton.module.css';

interface TonConnectButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

const TonConnectButton: React.FC<TonConnectButtonProps> = ({ className = '', style }) => {
  const { openModal, isConnected, wallet, disconnect } = useTonConnect();

  // Kullanıcı cüzdanını göster veya bağlan butonunu göster
  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      openModal();
    }
  };

  // Cüzdan bilgilerini güvenli bir şekilde gösterelim
  const getWalletInfo = () => {
    if (!wallet) return 'Wallet';

    // wallet.name özelliği doğrudan mevcut olmayabilir
    // o yüzden any tipini kullanarak güvenli erişim sağlıyoruz
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
