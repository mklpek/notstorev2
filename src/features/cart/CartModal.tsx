import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../core/store/hooks';
import { removeItem, changeQty, clearCart } from './cartSlice';
import { selectCartItems, selectCartTotal } from './selectors';
import {
  useGetCatalogueQuery,
  addPurchaseToHistory,
  catalogSelectors,
} from '../../core/api/notApi';
import Modal from '../../core/ui/Modal';
import ProgressiveImage from '../../core/ui/ProgressiveImage';
import styles from './CartModal.module.css';
import { useTonConnect } from '../../features/tonConnect';
import { createCartTransaction, ensureWalletConnection } from '../../features/tonConnect/buyNow';
import { SuccessModal } from '../../features/tonConnect';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();

  // Memoized selektörler kullanıyoruz
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);

  // TON Connect hook'unu kullan
  const { tonConnectUI, isConnected, sendTransaction } = useTonConnect();

  // API'den ürün bilgilerini çek - entities'i direkt olarak al
  const { data: catalogData } = useGetCatalogueQuery();

  // Başarılı ödeme modalı için state
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleRemove = (id: number) => {
    dispatch(changeQty({ id, delta: -1 }));
  };

  const isEmpty = cartItems.length === 0;

  // Satın alma işlemi - TON Connect entegrasyonu ile
  const handlePurchase = async () => {
    if (isEmpty || cartItems.length === 0) {
      onClose();
      return;
    }

    // Modal kapanmadan önce payment bilgilerini yerel değişkenlere kaydet
    const currentCartItems = [...cartItems];
    const currentCartTotal = cartTotal;

    try {
      // Cüzdan bağlantısı yoksa bağlantı modalını göster
      // TON Connect modalı açıldığında sepet modalını kapat
      const connected = await ensureWalletConnection(tonConnectUI, onClose);

      if (!connected) {
        console.log('Wallet connection required');
        return;
      }

      // Sepet için toplu ödeme transaction'ını oluştur - kaydedilen bilgileri kullan
      const transaction = createCartTransaction(currentCartItems, currentCartTotal);

      // Transaction'ı gönder
      await sendTransaction(transaction);

      // Başarılı işlem sonrası success modal'ı göster
      setSuccessModalOpen(true);

      // Sepeti temizle
      dispatch(clearCart());
    } catch (error) {
      console.error('Transaction error:', error);
      // Hata durumunda sepeti temizleme veya modalı kapatma
    }
  };

  // Her bir ürünü adetlerine göre tekrar ederek gösteren yapı - O(n²) karmaşıklık yerine O(n)
  const expandedCartItems = React.useMemo(() => {
    // catalogData yoksa erken dön
    if (!catalogData) return [];

    return cartItems.flatMap(item => {
      // EntityAdapter selektörünü kullanarak ürün bilgisini O(1) zamanda al
      const productFromApi = catalogSelectors.selectById(catalogData, item.id);
      const categoryToShow = item.category || productFromApi?.category || 'Product';

      // Her ürün için qty kadar kopya oluştur
      return Array.from({ length: item.qty }, (_, index) => ({
        ...item,
        category: categoryToShow,
        uniqueKey: `${item.id}-${index}`,
      }));
    });
  }, [cartItems, catalogData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isEmpty={isEmpty}>
      <div
        className={`${styles.cartModal} ${isEmpty ? styles.emptyCartModal : styles.filledCartModal}`}
      >
        {/* Close Button - Her zaman modalın sağ üstünde, header'dan bağımsız */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          // Stil boş sepetteki gibi olacak, gerekirse CSS'ten ayarlanacak
          style={
            isEmpty
              ? { position: 'absolute', top: '16px', right: '16px', zIndex: 10 }
              : {
                  /* Dolu sepet için stiller CSS'den gelecek */
                }
          }
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="16" fill="rgba(255, 255, 255, 0.08)" />
            <g opacity="0.2">
              <path
                d="M8.907 8.908L19.093 19.092"
                stroke="#B8CADF"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M19.093 8.908L8.907 19.092"
                stroke="#B8CADF"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </button>

        {isEmpty ? (
          <div className={styles.cartContent}>
            <div className={styles.emptyState}>
              <div className={styles.textSection}>
                <h2 className={styles.title}>Cart's cold</h2>
                <p className={styles.description}>No items yet</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header - Sadece Başlık içerir, ortalanmış */}
            <div className={styles.headerContainer}>
              <h2 className={styles.title}>Cart</h2>
            </div>

            {/* Lines - Figma'daki Lines yapısına uygun, header'dan footer'a kadar uzanır */}
            <div className={styles.lines}>
              {expandedCartItems.map(item => {
                return (
                  <div key={item.uniqueKey} className={styles.basketLine}>
                    <div className={styles.itemImage}>
                      <ProgressiveImage src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemName}>
                        <span className={styles.itemNamePrimary}>{item.category}</span>
                        <span className={styles.itemNameSecondary}>{item.name}</span>
                      </div>
                      <div className={styles.itemPrice}>
                        {item.price} {item.currency}
                      </div>
                    </div>
                    <button className={styles.removeButton} onClick={() => handleRemove(item.id)}>
                      <svg
                        className={styles.removeIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M1.25 8H14.75"
                          stroke="#B8CADF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Footer Button */}
        <div className={styles.cartFooter}>
          <button className={styles.okButton} onClick={isEmpty ? onClose : handlePurchase}>
            {isEmpty ? 'OK' : `Buy for ${cartTotal} NOT`}
          </button>
        </div>
      </div>

      {/* Başarılı ödeme modalı */}
      <SuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} />
    </Modal>
  );
};

export default CartModal;
