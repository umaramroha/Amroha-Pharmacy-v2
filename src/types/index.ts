export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number;
  image?: string;
  category?: string;
  description?: string;
  stock?: number;
  isActive?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerMobile: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}
