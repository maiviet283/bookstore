import axios from "axios";
import { API_BASE_URL } from "../config";
import { setGlobalError } from "../context/ErrorContext";
import { navigateTo } from "../utils/navigateHelper";


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

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


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ Không retry khi chính request đó là refresh-token
    if (originalRequest?.url?.includes("customers/refresh-token")) {
      return Promise.reject(error);
    }

    // 🔁 Nếu Access Token hết hạn (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ⚙️ Gọi refresh token mà KHÔNG gửi Authorization header
        const res = await axios.post(
          `${API_BASE_URL}/customers/refresh-token/`,
          {},
          { withCredentials: true }
        );

        const newAccess = res.data.data?.access;
        if (newAccess) {
          localStorage.setItem("access_token", newAccess);

          // Gắn token mới vào request cũ rồi gọi lại
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return api(originalRequest);
        }

        throw new Error("Không nhận được access token mới");
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        setGlobalError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigateTo("/login");
        return Promise.reject(refreshError);
      }
    }

    // ❗ Các lỗi khác
    const message =
      error.response?.data?.message ||
      error.message ||
      "Lỗi không xác định từ máy chủ.";
    setGlobalError(message);
    return Promise.reject(error);
  }
);

export default api;
