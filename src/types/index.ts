export interface MenuItem {
  id: string;
  name: string;
  description: string;
  prices: {
    small: number;
    big: number;
  };
  category: 'drink';
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  size: 'small' | 'big';
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address?: string;
  };
  paymentMethod: 'cash' | 'online';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
}