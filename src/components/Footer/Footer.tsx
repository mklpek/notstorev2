import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addItem, changeQty, removeItem } from '../../features/cart/cartSlice'
import { selectCartItemById } from '../../features/cart/selectors'
import PlusIcon from '../Icons/PlusIcon'
import MinusIcon from '../Icons/MinusIcon'
import styles from './Footer.module.css'
import type { Item } from '../../features/products/api'
import { useTonConnect } from '../../features/tonConnect'
import { SuccessModal } from '../../features/tonConnect'
import { 
  createBuyNowTransaction, 
  ensureWalletConnection
} from '../../features/tonConnect/buyNow'

interface FooterProps {
  product?: Item | null;
}

const Footer: React.FC<FooterProps> = ({ product }) => {
  const dispatch = useAppDispatch()
  
  // Redux'tan ürün bilgisini al (eğer sepette varsa)
  const cartItem = product ? useAppSelector(state => selectCartItemById(state, product.id)) : null
  
  // TON Connect hook'unu kullan
  const { tonConnectUI, isConnected, sendTransaction } = useTonConnect();
  
  // Başarılı ödeme modalı için state
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  // Store'dan direkt değerleri hesapla - yerel state tutma
  const qty = cartItem?.qty ?? 0
  const isInCart = !!cartItem
  
  const handleAddToCart = () => {
    if (!product) return
    
    dispatch(addItem({
      id: product.id,
      name: product.name, 
      category: product.category,
      price: product.price,
      currency: product.currency,
      image: product.images[0] || ''
      // Güvenlik önlemi fallback (şimdilik yorum satırında)
      // image: product.images[0] || '/images/product-1.png'
    }))
  }
  
  const decreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product) return
    
    dispatch(changeQty({ id: product.id, delta: -1 }))
  }
  
  const increaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product) return
    
    dispatch(changeQty({ id: product.id, delta: 1 }))
  }
  
  // Buy Now butonuna tıklandığında
  const handleBuyNow = async () => {
    if (!product) return;
    
    try {
      // Cüzdan bağlantısı yoksa bağlantı modalını göster
      const connected = await ensureWalletConnection(tonConnectUI);
      
      if (!connected) {
        console.log('Wallet connection required');
        return;
      }
      
      // Ödeme transaction'ını oluştur - sepetteki miktarı kullan
      // Sepette varsa sepetteki adet, yoksa 1 adet gönder
      const quantity = isInCart ? qty : 1;
      const transaction = createBuyNowTransaction(product, quantity);
      
      // Transaction'ı gönder
      await sendTransaction(transaction);
      
      // Başarılı işlem sonrası success modal'ı göster
      setSuccessModalOpen(true);
      
      // Eğer ürün sepette varsa, sepetten kaldır
      if (isInCart) {
        dispatch(removeItem(product.id));
      }
      
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };
  
  // Ürün detay sayfasında değilsek (ürün prop'u yoksa) standart footer göster
  if (!product) {
    return (
      <div className={styles.footer}>
        <div className={styles.body}>
          <button className={`${styles.button} ${styles.buyNow}`}>
            <div className={styles.labels}>
              Not Store
            </div>
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.body}>
          <button 
            className={`${styles.button} ${styles.addToCart}`}
            onClick={!isInCart ? handleAddToCart : undefined}
          >
            <div className={styles.labels}>
              {!isInCart ? (
                'Add to cart'
              ) : (
                <>
                  <MinusIcon 
                    className={styles.quantityButton}
                    onClick={decreaseQuantity}
                  />
                  <span className={styles.quantity}>{qty}</span>
                  <PlusIcon 
                    className={styles.countIcon}
                    onClick={increaseQuantity}
                  />
                </>
              )}
            </div>
          </button>
          <button 
            className={`${styles.button} ${styles.buyNow}`}
            onClick={handleBuyNow}
          >
            <div className={styles.labels}>
              Buy now
            </div>
          </button>
        </div>
      </div>
      
      {/* Başarılı ödeme modalı */}
      <SuccessModal 
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
      />
    </>
  )
}

export default Footer 