import { useContext } from 'react';
import { TonConnectUIContext } from './TonConnectProvider';

const useTonConnect = () => {
  const tonConnectUI = useContext(TonConnectUIContext);

  // TonConnectUI'den gerekli işlevleri dışa aktarıyoruz
  return {
    tonConnectUI,
    isConnected: tonConnectUI.connected,
    wallet: tonConnectUI.wallet,
    openModal: () => tonConnectUI.openModal(),
    closeModal: () => tonConnectUI.closeModal(),
    disconnect: () => tonConnectUI.disconnect(),
    // Send transaction metodu - ileri seviye kullanımlar için
    sendTransaction: tonConnectUI.sendTransaction.bind(tonConnectUI)
  };
};

export default useTonConnect; 