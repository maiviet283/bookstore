import axios, { AxiosHeaders } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "../config";
import { setGlobalError } from "../context/ErrorContext";
import { navigateTo } from "../utils/navigateHelper";

export interface ApiRequestOptions extends AxiosRequestConfig {
  useAccess?: boolean;   // có gắn access token không
  useRefresh?: boolean;  // có gửi cookie refresh token không
}

const baseConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

/**
 * 🔹 Hàm gọi API linh hoạt có xử lý Access & Refresh Token
 */
export const apiRequest = async <T>(
  options: ApiRequestOptions
): Promise<AxiosResponse<T>> => {
  const { useAccess, useRefresh, ...rest } = options;

  const instance = axios.create({
    ...baseConfig,
    withCredentials: !!useRefresh, // gửi cookie refresh nếu cần
  });

  // ===== Interceptor Request =====
  instance.interceptors.request.use(
    (config) => {
      if (useAccess) {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          if (config.headers instanceof AxiosHeaders) {
            config.headers.set("Authorization", `Bearer ${accessToken}`);
          } else {
            (config.headers as any) = {
              ...(config.headers || {}),
              Authorization: `Bearer ${accessToken}`,
            };
          }
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ===== Interceptor Response =====
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Trường hợp token hết hạn → tự refresh
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("refresh-token")
      ) {
        originalRequest._retry = true;
        try {
          const res = await apiRequest<{ data: { access: string } }>({
            url: "/customers/refresh-token/",
            method: "post",
            useRefresh: true,
          });

          const newAccess = res.data.data?.access;
          if (newAccess) {
            localStorage.setItem("access_token", newAccess);

            if (originalRequest.headers instanceof AxiosHeaders) {
              originalRequest.headers.set("Authorization", `Bearer ${newAccess}`);
            } else {
              (originalRequest.headers as any)["Authorization"] = `Bearer ${newAccess}`;
            }

            return axios(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          setGlobalError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigateTo("/login");
          return Promise.reject(refreshError);
        }
      }

      // Các lỗi khác
      const message =
        error.response?.data?.message ||
        error.message ||
        "Lỗi không xác định từ máy chủ.";
      setGlobalError(message);
      return Promise.reject(error);
    }
  );

  return instance(rest);
};
