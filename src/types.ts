/**
 * FreshMarket API and Data Models
 * Defined by Agent 1 (Product Manager/Architect)
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  unit: string; // e.g., "kg", "pack", "unit"
}

export interface CartItem {
  id: string; // Use product ID as cart item ID for simplicity in this demo
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: (CartItem & { product: Product })[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  customer: {
    name: string;
    address: string;
    email: string;
    upiId?: string;
  };
  createdAt: string;
}

export const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Meat', 'Beverages'];
