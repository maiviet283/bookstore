import axios from "axios";
import type { ApiResponse } from "../types/ApiResponse";
import type { BookListResponse, BookDetail } from "../types/Book";
import type { Category } from "../types/Category";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/",
  timeout: 10000,
});

export type GetBooksParams = {
  category?: string;
  search?: string;
  order?: "asc" | "desc" | ""
  page?: number;
};

export const bookApi = {
  async getBooks(params: GetBooksParams = {}, nextUrl?: string) {
    const response = await api.get<ApiResponse<BookListResponse>>(
      nextUrl ? nextUrl : "/books/",
      nextUrl ? undefined : { params }
    );
    return response.data
  },

  async getCategories() {
    const response = await api.get<ApiResponse<Category[]>>("books/categories/")
    return response.data
  },

  async getBookById(id: number) {
    const response = await api.get<ApiResponse<BookDetail>>(`books/${id}/`)
    return response.data
  },

  baseUrl: api.defaults.baseURL,
};
