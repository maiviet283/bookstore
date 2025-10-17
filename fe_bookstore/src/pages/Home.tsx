import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { bookApi } from "../apis/bookApi";
import type { BookListItem } from "../types/Book";
import { BASE_URL } from "../config";


export default function Home() {
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
      );

      if (url) {
        setBooks((prev) => [...prev, ...res.data.results]);
      } else {
        setBooks(res.data.results);
      }

      setNextUrl(res.data.next);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sách:", error);
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

  if (loading && books.length === 0)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
        Đang tải sách...
      </div>
    );

  if (!books || books.length === 0)
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        Không có sách nào để hiển thị.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📚 Danh sách sách
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/sach/${book.slug}`}
            state={{ id: book.id }}
            className="group border rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <img
              src={`${BASE_URL}${book.image}`}
              alt={book.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 line-clamp-2">
                {book.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Tác giả: {book.author}
              </p>
              <p className="mt-2 text-indigo-600 font-medium text-base">
                {Number(book.price).toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </Link>
        ))}
      </div>

      {loadingMore && (
        <div className="text-center mt-6 text-indigo-500 font-medium">
          Đang tải thêm sách...
        </div>
      )}

      {!nextUrl && !loadingMore && (
        <div className="text-center mt-8 text-gray-400 text-sm">
          🎉 Bạn đã xem hết danh sách rồi.
        </div>
      )}
    </div>
  );
}
