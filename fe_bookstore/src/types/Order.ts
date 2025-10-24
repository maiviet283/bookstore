export type OrderStatus = 
  | "pending"       // Chờ xử lý
  | "processing"    // Đang xử lý
  | "paid"          // Đã thanh toán
  | "delivered"     // Đã giao hàng
  | "cancelled";    // Đã hủy

export type PaymentMethod =
  | "cod"       // Thanh toán khi nhận hàng
  | "momo"      // MoMo
  | "zalopay"   // ZaloPay
  | "stripe"    // Stripe
  | "paypal";   // PayPal

export interface OrderItem {
  id: number;
  book_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_code: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  total_amount: number;
  item_count: number;
  created_at: string; // ISO string
  items: OrderItem[];
}

/** Response khi lấy danh sách đơn hàng */
export interface GetOrdersResponse {
  status: "success" | "error";
  message: string;
  data: Order[];
}

/** Response khi tạo đơn hàng thành công */
export interface CreateOrderResponse {
  status: "success";
  message: string;
  data: {
    order_code: string;
    total_amount: number;
    status: OrderStatus;
    payment_method: PaymentMethod;
    created_at: string;
  };
}

/** Response lỗi chung */
export interface ErrorResponse {
  status: "error";
  message: string;
}

