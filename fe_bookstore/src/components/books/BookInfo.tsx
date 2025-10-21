import type { BookDetail } from "../../types/Book";

interface BookInfoProps {
  book: BookDetail;
}

export default function BookInfo({ book }: BookInfoProps) {
  return (
    <div className="flex flex-col justify-center space-y-4">
      <h2 className="text-4xl font-bold text-gray-900 leading-snug">{book.name}</h2>
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
            <span className="text-green-600 font-semibold">{book.stock} quyển</span>
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
  );
}
