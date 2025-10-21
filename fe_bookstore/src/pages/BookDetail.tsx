import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { bookApi } from "../apis/bookApi";
import type { BookDetail, BookListItem } from "../types/Book";

import LoadingState from "../components/books/LoadingState";
import EmptyState from "../components/books/EmptyState";
import BookImageGallery from "../components/books/BookImageGallery";
import BookInfo from "../components/books/BookInfo";
import BookDescription from "../components/books/BookDescription";


export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const state = location.state as { id?: number } | null;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        let data: BookDetail | null = null;

        if (state?.id) {
          const res = await bookApi.getBookById(state.id);
          data = res.data;
        } else if (slug) {
          const allBooks = await bookApi.getBooks();
          const found: BookListItem | undefined = allBooks.data.results.find(
            (b) => b.slug === slug
          );
          if (found) {
            const res = await bookApi.getBookById(found.id);
            data = res.data;
          }
        }

        if (data) setBook(data);
      } catch (error) {
        console.error("Lỗi khi tải sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug, state]);

  if (loading) return <LoadingState />;
  if (!book) return <EmptyState />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <BookImageGallery book={book} />
        <BookInfo book={book} />
      </div>
      <BookDescription book={book} />
    </div>
  );
}
