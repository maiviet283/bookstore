import { apiRequest } from "./axiosConfig";
import type { ApiResponse } from "../types/ApiResponse";
import type { BookListResponse, BookDetail } from "../types/Book";
import type { Category } from "../types/Category";


export type GetBooksParams = {
  category?: string;
  search?: string;
  order?: "asc" | "desc" | "";
  page?: number;
};


export const bookApi = {
  async getBooks(params: GetBooksParams = {}, nextUrl?: string) {
    const res = await apiRequest<ApiResponse<BookListResponse>>({
      url: nextUrl || "/books/",
      method: "get",
      params: nextUrl ? undefined : params,
      showAlert: false,
    });
    return res.data;
  },

  async getCategories() {
    const res = await apiRequest<ApiResponse<Category[]>>({
      url: "/books/categories/",
      method: "get",
      showAlert: false,
    });
    return res.data;
  },

  async getBookById(id: number) {
    const res = await apiRequest<ApiResponse<BookDetail>>({
      url: `/books/${id}/`,
      method: "get",
      showAlert: false,
    });
    return res.data;
  },
};
