import api from "./axiosConfig";
import type { ApiResponse } from "../types/ApiResponse";
import type {
    LoginData,
    LoginResponse,
    RegisterData,
    Customer,
    UpdateCustomerData,
} from "../types/Customer";


export const authApi = {
    async login(data: LoginData) {
        const res = await api.post<ApiResponse<LoginResponse>>("customers/login/", data);

        if (res.data.data?.access) {
            localStorage.setItem("access_token", res.data.data.access);
        }

        return res.data;
    },


    async logout() {
        const res = await api.post<ApiResponse<null>>("customers/logout/");
        localStorage.removeItem("access_token");
        return res.data;
    },


    async getProfile() {
        const access = localStorage.getItem("access_token");
        const res = await api.get<ApiResponse<Customer>>("customers/me/", {
            headers: { Authorization: `Bearer ${access}` },
        });
        return res.data;
    },


    async register(data: RegisterData) {
        const res = await api.post<ApiResponse<Customer>>("customers/register/", data);
        return res.data;
    },


    async updateProfile(data: FormData | UpdateCustomerData) {
        return api.patch<ApiResponse<Customer>>("customers/update/", data, {
            headers: data instanceof FormData
                ? { "Content-Type": "multipart/form-data" }
                : { "Content-Type": "application/json" },
        }).then(res => res.data);
    },

};
