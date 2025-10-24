import { apiRequest } from "./axiosConfig";
import type { ApiResponse } from "../types/ApiResponse";
import type {
    LoginData,
    LoginResponse,
    RegisterData,
    Customer,
    UpdateCustomerData,
    ChangePasswordData
} from "../types/Customer";


export const authApi = {
    async login(data: LoginData) {
        const res = await apiRequest<ApiResponse<LoginResponse>>({
            url: "/customers/login/",
            method: "post",
            data,
            useRefresh: true,
        });

        const token = res.data.data?.access;
        if (token) localStorage.setItem("access_token", token);
        return res.data;
    },

    async logout() {
        const res = await apiRequest<ApiResponse<null>>({
            url: "/customers/logout/",
            method: "post",
            useAccess: true,
            useRefresh: true,
            showAlert: true,
        });
        localStorage.removeItem("access_token");
        return res.data;
    },

    async getProfile() {
        const res = await apiRequest<ApiResponse<Customer>>({
            url: "/customers/me/",
            method: "get",
            useAccess: true,
            showAlert: false,
        });
        return res.data;
    },

    async register(data: RegisterData) {
        const res = await apiRequest<ApiResponse<Customer>>({
            url: "/customers/register/",
            method: "post",
            data,
        });
        return res.data;
    },

    async updateProfile(data: FormData | UpdateCustomerData) {
        const res = await apiRequest<ApiResponse<Customer>>({
            url: "/customers/update/",
            method: "patch",
            data,
            useAccess: true,
            headers:
                data instanceof FormData
                    ? { "Content-Type": "multipart/form-data" }
                    : { "Content-Type": "application/json" },
        });
        return res.data;
    },

    async changePassword(data: FormData | ChangePasswordData) {
        const res = await apiRequest<ApiResponse<Customer>>({
            url: "/customers/change-password/",
            method: "patch",
            data,
            useAccess: true,
        });
        return res.data;
    },
};
