/******************************************************************************
 * File: buyNow.ts
 * Layer: feature
 * Desc: TON Connect transaction utilities for product purchases and cart payments
 ******************************************************************************/

import type { SendTransactionRequest } from '@tonconnect/ui';
import { TonConnectUI } from '@tonconnect/ui-react';
import type { Item } from '../catalogue/api';
import type { CartItem } from '../cart/types';

/**
 * Prepares parameters for payment via TON Connect
 * Creates a transaction request for single product purchase
 * @param product - Product to be purchased
 * @param quantity - Quantity to purchase (default: 1)
 * @returns TON Connect transaction request
 */
export const createBuyNowTransaction = (
  product: Item,
  quantity: number = 1
): SendTransactionRequest => {
  // Multiply product price by quantity
  const totalPrice = product.price * quantity;

  // Convert total price to TON format (1 TON = 10^9 nanoTON)
  // For example, 1000 NOT = 1000 TON
  const amountInNanoTons = BigInt(totalPrice) * BigInt(10 ** 9);

  // For a real application, use seller address from backend
  // Using example address for now
  const sellerAddress = 'UQBvW8AHQ2tW3VQ-TUH6R76BmQs6-JU0MUeIiBeR7yzYF6mJ';

  // Create transaction object
  return {
    validUntil: Math.floor(Date.now() / 1000) + 360, // Valid for 5 minutes
    messages: [
      {
        address: sellerAddress,
        amount: amountInNanoTons.toString(),
        // Add purchase information as message (product name, category, quantity)
        payload: `Buy ${quantity}x ${product.category} ${product.name} for ${totalPrice} ${product.currency}`,
      },
    ],
  };
};

/**
 * Creates bulk payment transaction for all cart items
 * Handles multiple products in a single transaction
 * @param cartItems - All items in the cart
 * @param totalAmount - Total payment amount
 * @returns TON Connect transaction request
 */
export const createCartTransaction = (
  cartItems: CartItem[],
  totalAmount: number
): SendTransactionRequest => {
  // Convert total amount to TON format (1 TON = 10^9 nanoTON)
  const amountInNanoTons = BigInt(totalAmount) * BigInt(10 ** 9);

  // For a real application, use seller address from backend
  // Using example address for now
  const sellerAddress = 'UQBvW8AHQ2tW3VQ-TUH6R76BmQs6-JU0MUeIiBeR7yzYF6mJ';

  // Format cart items as text description
  const itemsDescription = cartItems
    .map(item => `${item.qty}x ${item.category} ${item.name}`)
    .join(', ');

  // Create transaction object
  return {
    validUntil: Math.floor(Date.now() / 1000) + 360, // Valid for 5 minutes
    messages: [
      {
        address: sellerAddress,
        amount: amountInNanoTons.toString(),
        // Add purchase information as message (cart summary)
        payload: `Cart purchase: ${itemsDescription} - Total: ${totalAmount} NOT`,
      },
    ],
  };
};

/**
 * Shows modal if wallet is not connected
 * Handles wallet connection flow with timeout and polling
 * @param tonConnectUI - TonConnectUI instance
 * @param onModalOpen - Optional callback when modal opens
 * @returns Promise<boolean> - Whether user is connected to wallet
 */
export const ensureWalletConnection = async (
  tonConnectUI: TonConnectUI,
  onModalOpen?: () => void
): Promise<boolean> => {
  if (!tonConnectUI.connected) {
    // Open modal and wait for user to connect
    tonConnectUI.openModal();

    // Call callback when modal opens
    if (onModalOpen) {
      onModalOpen();
    }

    // Use simpler method to wait for connection status
    // This solves the problem of missing onModalClosed method
    return new Promise<boolean>(resolve => {
      // Use interval to check connection status
      const checkInterval = setInterval(() => {
        if (tonConnectUI.connected) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 1000);

      // Timeout after 30 seconds, assume no connection
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!tonConnectUI.connected) {
          resolve(false);
        }
      }, 30000);
    });
  }

  return true;
};
