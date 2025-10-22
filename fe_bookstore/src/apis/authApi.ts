import { api, authApiClient } from "./axiosConfig";
import type { ApiResponse } from "../types/ApiResponse";
import type {
    LoginData,
    LoginResponse,
    RegisterData,
    Customer,
    UpdateCustomerData,
} from "../types/Customer";


export const authApi = {
    // 🔹 Đăng nhập — gửi cookie refresh
    async login(data: LoginData) {
        const res = await authApiClient.post<ApiResponse<LoginResponse>>(
            "customers/login/",
            data
        );

        if (res.data.data?.access) {
            localStorage.setItem("access_token", res.data.data.access);
        }

        return res.data;
    },

    // 🔹 Đăng xuất — gửi cookie refresh
    async logout() {
        const res = await authApiClient.post<ApiResponse<null>>("customers/logout/");
        localStorage.removeItem("access_token");
        return res.data;
    },

    // 🔹 Lấy profile — chỉ cần access token
    async getProfile() {
        const res = await api.get<ApiResponse<Customer>>("customers/me/");
        return res.data;
    },

    // 🔹 Đăng ký — không cần token
    async register(data: RegisterData) {
        const res = await api.post<ApiResponse<Customer>>(
            "customers/register/",
            data
        );
        return res.data;
    },

    // 🔹 Cập nhật profile
    async updateProfile(data: FormData | UpdateCustomerData) {
        const headers =
            data instanceof FormData
                ? { "Content-Type": "multipart/form-data" }
                : { "Content-Type": "application/json" };

        const res = await api.patch<ApiResponse<Customer>>(
            "customers/update/",
            data,
            { headers }
        );
        return res.data;
    },
};
