export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  sold?: number;
  ratingAverage?: number;
  ratingCount?: number;
  featured?: boolean;
  tag?: "new" | "trending" | "bestseller";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  address: string;
  mobile: string;
  image?: string;
  role: "buyer" | "seller";
}

export interface Transaction {
  id: string;
  userId?: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "completed" | "cancelled";
  statusHistory?: Array<{ status: Transaction["status"]; at: string }>;
}
