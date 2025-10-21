import type { BookDetail } from "../../types/Book";

export default function BookDescription({ book }: { book: BookDetail }) {
  return (
    <div className="mt-16 bg-white p-8 rounded-2xl shadow-inner">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
        📖 Giới thiệu về sách
      </h3>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {book.description}
      </p>
    </div>
  );
}
