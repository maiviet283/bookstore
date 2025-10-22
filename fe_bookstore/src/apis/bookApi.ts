import api from "./axiosConfig";
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
    const res = await api.get<ApiResponse<BookListResponse>>(
      nextUrl ?? "/books/",
      nextUrl ? undefined : { params }
    );
    return res.data;
  },

  async getCategories() {
    const res = await api.get<ApiResponse<Category[]>>("books/categories/");
    return res.data;
  },

  async getBookById(id: number) {
    const res = await api.get<ApiResponse<BookDetail>>(`books/${id}/`);
    return res.data;
  },
};
