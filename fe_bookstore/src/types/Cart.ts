export interface CartItem {
  id: number;
  book_id: number;
  book_name: string;
  book_image: string | null;
  book_price: number;
  quantity: number;
  price_at_time: string;
}

export interface Cart {
  id: number;
  status: "active" | "inactive" | string;
  total_amount: number;
  items: CartItem[];
}

export interface CartResponse {
  status: "success" | "error";
  message: string;
  data?: Cart;
}

export interface UpdateCartResponse {
  status: "success" | "error";
  message: string;
  data?: {
    total?: number;
  };
}

export type CartAction = "add" | "remove" | "set" | "clear";

export interface UpdateCartParams {
  book_id: number;
  action: CartAction;
  quantity?: number;
}
