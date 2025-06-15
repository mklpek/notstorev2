/******************************************************************************
 * File: Footer.tsx
 * Layer: layout
 * Desc: Product detail footer with cart controls and TON Connect purchase functionality
 ******************************************************************************/

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../core/store/hooks';
import { addItem, changeQty, removeItem } from '../../features/cart/cartSlice';
import { selectCartItemById } from '../../features/cart/selectors';
import PlusIcon from '../../core/ui/Icons/PlusIcon';
import MinusIcon from '../../core/ui/Icons/MinusIcon';
import styles from './Footer.module.css';
import type { Item } from '../../features/catalogue/api';
import { useTonConnect } from '../../features/tonConnect';
import { SuccessModal } from '../../features/tonConnect';
import { createBuyNowTransaction, ensureWalletConnection } from '../../features/tonConnect/buyNow';

interface FooterProps {
  product?: Item | null;
}

/**
 * Product detail footer component
 * Handles cart operations and TON Connect purchases
 * @param product - Product item for cart operations
 * @returns JSX element containing footer with cart and purchase controls
 */
const Footer: React.FC<FooterProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  // Get product information from Redux (if it exists in cart)
  const cartItem = product ? useAppSelector(state => selectCartItemById(state, product.id)) : null;

  // Use TON Connect hook
  const { tonConnectUI, isConnected, sendTransaction } = useTonConnect();

  // State for success payment modal
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Calculate values directly from store - avoid local state
  const qty = cartItem?.qty ?? 0;
  const isInCart = !!cartItem;

  /**
   * Handles adding product to cart
   * Creates new cart item with product details
   */
  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        currency: product.currency,
        image: product.images[0] || '',
        // Security fallback (commented for now)
        // image: product.images[0] || '/images/product-1.png'
      })
    );
  };

  /**
   * Handles decreasing product quantity
   * @param e - Mouse event to prevent propagation
   */
  const decreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;

    dispatch(changeQty({ id: product.id, delta: -1 }));
  };

  /**
   * Handles increasing product quantity
   * @param e - Mouse event to prevent propagation
   */
  const increaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;

    dispatch(changeQty({ id: product.id, delta: 1 }));
  };

  /**
   * Handles Buy Now button click
   * Manages wallet connection and transaction processing
   */
  const handleBuyNow = async () => {
    if (!product) return;

    try {
      // Show wallet connection modal if not connected
      const connected = await ensureWalletConnection(tonConnectUI);

      if (!connected) {
        console.log('Wallet connection required');
        return;
      }

      // Create payment transaction - use cart quantity
      // If in cart use cart quantity, otherwise send 1 item
      const quantity = isInCart ? qty : 1;
      const transaction = createBuyNowTransaction(product, quantity);

      // Send transaction
      await sendTransaction(transaction);

      // Show success modal after successful transaction
      setSuccessModalOpen(true);

      // If product is in cart, remove it from cart
      if (isInCart) {
        dispatch(removeItem(product.id));
      }
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  // If not on product detail page (no product prop), show standard footer
  if (!product) {
    return (
      <div className={styles.footer}>
        <div className={styles.body}>
          <button className={`${styles.button} ${styles.buyNow}`}>
            <div className={styles.labels}>Not Store</div>
          </button>
        </div>
      </div>
    );
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
                  <MinusIcon className={styles.quantityButton} onClick={decreaseQuantity} />
                  <span className={styles.quantity}>{qty}</span>
                  <PlusIcon className={styles.countIcon} onClick={increaseQuantity} />
                </>
              )}
            </div>
          </button>
          <button className={`${styles.button} ${styles.buyNow}`} onClick={handleBuyNow}>
            <div className={styles.labels}>Buy now</div>
          </button>
        </div>
      </div>

      {/* Success payment modal */}
      <SuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} />
    </>
  );
};

export default Footer;
