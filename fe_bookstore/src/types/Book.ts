import type { Category } from "./Category";

export type BookImage = {
  id: number;
  image: string;
  alt: string;
};

export type BookDetail = {
  id: number;
  category: Category;
  images: BookImage[];
  image: string;
  name: string;
  description: string;
  slug: string;
  author: string;
  publisher: string;
  published_date: string;
  language: string;
  price: string;
  stock: number;
};

export type BookListItem = {
  id: number;
  name: string;
  image: string;
  price: string;
  author: string;
  slug: string;
};

export type BookListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookListItem[];
};
