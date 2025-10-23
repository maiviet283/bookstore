import { apiRequest } from "./axiosConfig";
import type { ApiResponse } from "../types/ApiResponse";
import type { Cart } from "../types/Cart";


export const cartApi = {
    async getCart() {
        const res = await apiRequest<ApiResponse<Cart>>({
            url: "/carts/",
            method: "get",
            useAccess: true,
            showAlert: false,
        });
        return res.data;
    },

    async addItem(bookId: number, quantity = 1) {
        const res = await apiRequest<ApiResponse<{ total: number }>>({
            url: `/carts/update/${bookId}/?action=add`,
            method: "post",
            data: { quantity },
            useAccess: true,
            showAlert: false,
        });
        return res.data;
    },

    async removeItem(bookId: number, quantity = 1) {
        const res = await apiRequest<ApiResponse<{ total: number }>>({
            url: `/carts/update/${bookId}/?action=remove`,
            method: "post",
            data: { quantity },
            useAccess: true,
            showAlert: false,
        });
        return res.data;
    },

    async setItemQuantity(bookId: number, quantity: number) {
        const res = await apiRequest<ApiResponse<{ total: number }>>({
            url: `/carts/update/${bookId}/?action=set`,
            method: "post",
            data: { quantity },
            useAccess: true,
            showAlert: false,
        });
        return res.data;
    },

    async clearCart() {
        const res = await apiRequest<ApiResponse<null>>({
            url: `/carts/update/0/?action=clear`,
            method: "post",
            useAccess: true,
        });
        return res.data;
    },
};
