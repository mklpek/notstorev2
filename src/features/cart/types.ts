export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: string; // 'NOT'
  image: string;
  qty: number;
} 