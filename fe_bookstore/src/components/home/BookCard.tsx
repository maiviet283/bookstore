import { Link } from "react-router-dom";
import { BASE_URL } from "../../config";
import type { BookListItem } from "../../types/Book";
import { cartApi } from "../../apis/cartApi";
import { useState } from "react";
import AlertDialog from "../AlertDialog";
import { useAuth } from "../../context/AuthContext";

interface BookCardProps {
  book: BookListItem;
}

const BookCard = ({ book }: BookCardProps) => {
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await cartApi.addItem(book.id, 1);
      setAlert({ show: true, message: `Đã thêm "${book.name}" vào giỏ hàng!` });
    } catch (err) {
      console.error(err);
      setAlert({ show: true, message: "Thêm vào giỏ hàng thất bại!" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Link
        to={`/sach/${book.slug}`}
        state={{ id: book.id }}
        className="group flex flex-col border rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-all duration-300"
      >
        {/* Ảnh sách */}
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={`${BASE_URL}${book.image}`}
            alt={book.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Nội dung */}
        <div className="flex flex-col flex-grow justify-between p-4">
          <div>
            <h3
              className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 line-clamp-2"
              title={book.name}
            >
              {book.name}
            </h3>
            <p
              className="text-sm text-gray-500 mt-1 line-clamp-1"
              title={book.author}
            >
              Tác giả: {book.author}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-indigo-600 font-semibold text-base">
              {Number(book.price).toLocaleString("vi-VN")} VNĐ
            </p>

            {isAuthenticated && (
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`p-2 rounded-lg text-white transition-all duration-200 shadow-sm
                  ${adding
                    ? "bg-indigo-400 cursor-wait"
                    : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                  }`}
                title="Thêm vào giỏ hàng"
              >
                {adding ? (
                  <span className="text-sm animate-pulse">Đang thêm...</span>
                ) : (
                  <span className="text-lg">🛒</span>
                )}
              </button>
            )}
          </div>
        </div>
      </Link>

      <AlertDialog
        message={alert.message}
        show={alert.show}
        duration={2000}
        onClose={() => setAlert({ show: false, message: "" })}
      />
    </>
  );
};

export default BookCard;
