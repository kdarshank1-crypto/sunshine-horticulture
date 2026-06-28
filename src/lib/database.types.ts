export interface Product {
  id: string;
  name: string;
  description: string | null;
  price_retail: number;
  price_bulk: number;
  image_url: string | null;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  tag: string | null;
  created_at: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
}

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  shipping_address: ShippingAddress;
  total_amount: number;
  payment_status: "pending" | "paid" | "failed";
  stripe_session_id: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  pack_type: "retail" | "bulk";
  price_at_time_of_order: number;
}

export type PackType = "retail" | "bulk";

export interface CartItem {
  productId: string;
  name: string;
  packType: PackType;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
      orders: {
        Row: Order;
        Insert: {
          id?: string;
          customer_email: string;
          customer_name: string;
          customer_phone?: string | null;
          shipping_address: ShippingAddress;
          total_amount: number;
          payment_status?: "pending" | "paid" | "failed";
          stripe_session_id?: string | null;
          created_at?: string;
        };
        Update: {
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string | null;
          shipping_address?: ShippingAddress;
          total_amount?: number;
          payment_status?: "pending" | "paid" | "failed";
          stripe_session_id?: string | null;
        };
      };
      order_items: {
        Row: OrderItem;
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          pack_type: "retail" | "bulk";
          price_at_time_of_order: number;
        };
        Update: Partial<Omit<OrderItem, "id">>;
      };
    };
  };
}
