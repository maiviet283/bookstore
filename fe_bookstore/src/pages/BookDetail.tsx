import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { bookApi } from "../apis/bookApi";
import type { BookDetail, BookListItem } from "../types/Book";
import { BASE_URL } from "../config";

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const state = location.state as { id?: number } | null;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);

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

        if (data) {
          setBook(data);
          setMainImage(`${BASE_URL}${data.image}`);
        }
      } catch (error) {
        console.error("Lỗi khi tải sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug, state]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-lg animate-pulse">
        Đang tải chi tiết sách...
      </div>
    );

  if (!book)
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        Không tìm thấy sách.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* --- Cột 1: Hình ảnh --- */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={mainImage ?? `${BASE_URL}${book.image}`}
              alt={book.name}
              className="rounded-2xl shadow-xl w-80 h-96 object-cover border border-gray-200 group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
              {book.category?.name}
            </span>
          </div>

          {book.images.length > 0 && (
            <div className="flex gap-3 mt-5 overflow-x-auto pb-2">
              {book.images.map((img) => (
                <img
                  key={img.id}
                  src={`${BASE_URL}${img.image}`}
                  alt={img.alt}
                  className={`w-20 h-24 object-cover rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    mainImage === `${BASE_URL}${img.image}`
                      ? "border-indigo-500 shadow-md scale-105"
                      : "border-gray-200 hover:border-indigo-400"
                  }`}
                  onClick={() => setMainImage(`${BASE_URL}${img.image}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- Cột 2: Thông tin --- */}
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-900 leading-snug">
            {book.name}
          </h2>
          <p className="text-gray-600 text-lg italic">
            ✍️ Tác giả: <span className="font-medium">{book.author}</span>
          </p>

          <div className="text-gray-700 space-y-1 text-base">
            <p>
              <span className="font-semibold text-gray-800">Nhà xuất bản:</span>{" "}
              {book.publisher}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Ngày xuất bản:</span>{" "}
              {new Date(book.published_date).toLocaleDateString("vi-VN")}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Ngôn ngữ:</span>{" "}
              {book.language}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Số lượng còn lại:</span>{" "}
              {book.stock > 0 ? (
                <span className="text-green-600 font-semibold">
                  {book.stock} quyển
                </span>
              ) : (
                <span className="text-red-500 font-semibold">Hết hàng</span>
              )}
            </p>
          </div>

          <div className="pt-2">
            <p className="text-3xl font-bold text-indigo-600">
              {Number(book.price).toLocaleString("vi-VN")} ₫
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 active:scale-95">
              🛒 Thêm vào giỏ hàng
            </button>
            <button className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 hover:shadow-md transition-all duration-300 active:scale-95">
              ❤️ Yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* --- Mô tả sách --- */}
      <div className="mt-16 bg-white p-8 rounded-2xl shadow-inner">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          📖 Giới thiệu về sách
        </h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {book.description}
        </p>
      </div>
    </div>
  );
}
