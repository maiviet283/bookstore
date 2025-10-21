import axios from "axios";

import { API_BASE_URL } from "../config";
import { setGlobalError } from "../context/ErrorContext";
import type { ApiResponse } from "../types/ApiResponse";


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    if (response.data?.status === "error") {
      setGlobalError(response.data.message || "Đã xảy ra lỗi không xác định.");
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post<ApiResponse<{ access: string }>>("customers/refresh-token/");
        if (res.data.data?.access) {
          localStorage.setItem("access_token", res.data.data.access);
          originalRequest.headers["Authorization"] = `Bearer ${res.data.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        setGlobalError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message || error.message || "Lỗi không xác định từ máy chủ.";
    setGlobalError(message);

    return Promise.reject(error);
  }
);

export default api;
