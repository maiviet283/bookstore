import { apiRequest } from "./axiosConfig";
import type {
    GetOrdersResponse,
    CreateOrderResponse,
    ErrorResponse
} from "../types/Order";


export interface CreateOrderPayload {
  shipping_address: string;
  payment_method?: "cod" | "momo" | "zalopay" | "stripe" | "paypal";
  note?: string;
}

export const orderApi = {
    async getOrders() {
        const res = await apiRequest<GetOrdersResponse>({
            url: "/orders/",
            method: "get",
            useAccess: true,
            useRefresh: false,
            showAlert: false,
        });
        return res.data;
    },

    async createOrder(payload: CreateOrderPayload) {
        const res = await apiRequest<CreateOrderResponse | ErrorResponse>({
            url: "/orders/create/",
            method: "post",
            useAccess: true,
            useRefresh: false,
            data: payload,
            showAlert: true,
        });
        return res.data;
    },

};
