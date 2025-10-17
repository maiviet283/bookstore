import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
    >
      <img src={book.image} alt={book.name} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">{book.name}</h3>
        <p className="text-gray-500 text-sm">{book.author}</p>
        <p className="text-orange-600 font-bold mt-2">
          {Number(book.price).toLocaleString("vi-VN")}₫
        </p>
      </div>
    </div>
  );
};

export default BookCard;
