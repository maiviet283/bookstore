import axios from "axios";
import { API_BASE_URL } from "../config";
import { setGlobalError } from "../context/ErrorContext";
import type { ApiResponse } from "../types/ApiResponse";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 🔥 BẮT BUỘC để browser gửi cookie refresh
});

// --------------------
// 🔹 REQUEST INTERCEPTOR
// --------------------
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------
// 🔹 RESPONSE INTERCEPTOR
// --------------------
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ❌ Không retry khi chính request đó là refresh-token
    if (originalRequest?.url?.includes("customers/refresh-token")) {
      return Promise.reject(error);
    }

    // 🔁 Nếu Access Token hết hạn (401) → gọi refresh token API
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi refresh-token (cookie refresh tự động gửi kèm)
        const res = await api.post("customers/refresh-token/", {}, { withCredentials: true })
        const newAccess = res.data.data?.access;
        if (newAccess) {
          // ✅ Lưu lại Access token mới
          localStorage.setItem("access_token", newAccess);

          // Gắn vào request cũ rồi gọi lại
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return api(originalRequest);
        }

        throw new Error("Không nhận được access token mới");
      } catch (refreshError) {
        // 🚫 Refresh thất bại → đăng xuất
        localStorage.removeItem("access_token");
        setGlobalError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // ❗ Các lỗi khác
    const message =
      error.response?.data?.message || error.message || "Lỗi không xác định từ máy chủ.";
    setGlobalError(message);
    return Promise.reject(error);
  }
);

export default api;
