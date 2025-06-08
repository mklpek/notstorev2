import type { SendTransactionRequest } from '@tonconnect/ui';
import type { Item } from '../products/api';
import type { CartItem } from '../cart/types';

/**
 * TON Connect üzerinden ödeme yapılması için gereken parametreleri hazırlar
 * @param product Satın alınacak ürün
 * @param quantity Satın alınacak ürün adedi (varsayılan: 1)
 * @returns TON Connect transaction request
 */
export const createBuyNowTransaction = (
  product: Item,
  quantity: number = 1
): SendTransactionRequest => {
  // Ürün fiyatını adet ile çarp
  const totalPrice = product.price * quantity;

  // Toplam fiyatı TON formatına çevirme (1 TON = 10^9 nanoTON)
  // Örnek olarak 1000 NOT = 1000 TON olarak kabul ediyoruz
  const amountInNanoTons = BigInt(totalPrice) * BigInt(10 ** 9);

  // Gerçek bir uygulama için burada backend'den alınan satıcı adresini kullanmak gerekir
  // Şimdilik örnek bir adres kullanıyoruz
  const sellerAddress = 'UQBvW8AHQ2tW3VQ-TUH6R76BmQs6-JU0MUeIiBeR7yzYF6mJ';

  // Transaction nesnesini oluştur
  return {
    validUntil: Math.floor(Date.now() / 1000) + 360, // 5 dakika geçerli
    messages: [
      {
        address: sellerAddress,
        amount: amountInNanoTons.toString(),
        // Satın alma bilgilerini mesaj olarak ekle (ürün adı, kategori, adet)
        payload: `Buy ${quantity}x ${product.category} ${product.name} for ${totalPrice} ${product.currency}`,
      },
    ],
  };
};

/**
 * Sepetteki tüm ürünler için toplu ödeme transaction'ı oluşturur
 * @param cartItems Sepetteki tüm ürünler
 * @param totalAmount Toplam ödeme tutarı
 * @returns TON Connect transaction request
 */
export const createCartTransaction = (
  cartItems: CartItem[],
  totalAmount: number
): SendTransactionRequest => {
  // Toplam tutarı TON formatına çevirme (1 TON = 10^9 nanoTON)
  const amountInNanoTons = BigInt(totalAmount) * BigInt(10 ** 9);

  // Gerçek bir uygulama için burada backend'den alınan satıcı adresini kullanmak gerekir
  // Şimdilik örnek bir adres kullanıyoruz
  const sellerAddress = 'UQBvW8AHQ2tW3VQ-TUH6R76BmQs6-JU0MUeIiBeR7yzYF6mJ';

  // Sepetteki ürünleri bir metin olarak biçimlendir
  const itemsDescription = cartItems
    .map(item => `${item.qty}x ${item.category} ${item.name}`)
    .join(', ');

  // Transaction nesnesini oluştur
  return {
    validUntil: Math.floor(Date.now() / 1000) + 360, // 5 dakika geçerli
    messages: [
      {
        address: sellerAddress,
        amount: amountInNanoTons.toString(),
        // Satın alma bilgilerini mesaj olarak ekle (sepet özeti)
        payload: `Cart purchase: ${itemsDescription} - Total: ${totalAmount} NOT`,
      },
    ],
  };
};

/**
 * Cüzdan bağlantısı yoksa açılan bir modal gösterir
 * @param tonConnectUI TonConnectUI instance
 * @param onModalOpen Modal açıldığında çağrılacak opsiyonel callback
 * @returns Promise<boolean> - Kullanıcı cüzdana bağlı mı
 */
export const ensureWalletConnection = async (
  tonConnectUI: any,
  onModalOpen?: () => void
): Promise<boolean> => {
  if (!tonConnectUI.connected) {
    // Modal açılır ve kullanıcının bağlanmasını bekler
    tonConnectUI.openModal();

    // Modal açıldığında callback'i çağır
    if (onModalOpen) {
      onModalOpen();
    }

    // Daha basit bir yöntem kullanarak bağlantı durumunu bekle
    // Bu, onModalClosed yönteminin olmaması sorununu çözer
    return new Promise<boolean>(resolve => {
      // Bağlantı durumunu kontrol etmek için bir interval kullan
      const checkInterval = setInterval(() => {
        if (tonConnectUI.connected) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 1000);

      // 30 saniye sonra timeout ile bağlantı olmadığını kabul et
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
