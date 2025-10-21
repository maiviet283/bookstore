import { useEffect, useState, useCallback } from "react"

import type { BookListItem } from "../types/Book"
import { bookApi } from "../apis/bookApi"


export function useBooks() {
  const [books, setBooks] = useState<BookListItem[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchBooks = useCallback(async (url?: string) => {
    try {
      if (url) setLoadingMore(true);

      const res = await bookApi.getBooks(
        { category: "", order: "", page: 1 },
        url
      )

      if (url) {
        setBooks((prev) => {
          const newBooks = res.data.results.filter(
            (b) => !prev.some((p) => p.id === b.id)
          );
          return [...prev, ...newBooks];
        });
      } else {
        setBooks(res.data.results);
      }

      setNextUrl(res.data.next);
    } catch (err) {
      console.error("Lỗi khi tải sách:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300 &&
        nextUrl &&
        !loadingMore
      ) {
        fetchBooks(nextUrl);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextUrl, loadingMore, fetchBooks]);

  return { books, nextUrl, loading, loadingMore };
}
