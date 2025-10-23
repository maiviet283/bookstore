import axios, { AxiosHeaders } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "../config";
import { setGlobalAlert } from "../context/ErrorContext";
import { navigateTo } from "../utils/navigateHelper";


export interface ApiRequestOptions extends AxiosRequestConfig {
  useAccess?: boolean;
  useRefresh?: boolean;
  showAlert?: boolean;
}

const baseConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

export const apiRequest = async <T>(
  options: ApiRequestOptions
): Promise<AxiosResponse<T>> => {
  const { useAccess, useRefresh, showAlert = true, ...rest } = options;

  const instance = axios.create({
    ...baseConfig,
    withCredentials: !!useRefresh,
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
            (config.headers as Record<string, string>) = {
              ...(config.headers as Record<string, string>),
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
    (response) => {
      const resData: any = response.data;
      // ✅ Chỉ hiển thị alert khi showAlert = true
      if (showAlert && resData?.status === "success" && resData?.message) {
        setGlobalAlert("success", resData.message);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Token hết hạn → tự refresh
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
            showAlert: false,
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
          if (showAlert) {
            setGlobalAlert("error", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          }
          navigateTo("/login");
          return Promise.reject(refreshError);
        }
      }

      const message =
        error.response?.data?.message ||
        error.response?.message ||
        error.message ||
        "Lỗi không xác định từ máy chủ";

      if (showAlert) setGlobalAlert("error", message);
      return Promise.reject(error);
    }
  );

  return instance(rest);
};
