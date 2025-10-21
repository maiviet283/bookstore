import { Link } from "react-router-dom";
import { BASE_URL } from "../../config";
import type { BookListItem } from "../../types/Book";

interface BookCardProps {
  book: BookListItem;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link
      to={`/sach/${book.slug}`}
      state={{ id: book.id }}
      className="group flex flex-col border rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={`${BASE_URL}${book.image}`}
          alt={book.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col flex-grow justify-between p-4">
        <div>
          <h3
            className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 line-clamp-2 h-[3.5rem]"
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

        <p className="mt-3 text-indigo-600 font-medium text-base">
          {Number(book.price).toLocaleString("vi-VN")} VNĐ
        </p>
      </div>
    </Link>
  );
}

export default BookCard