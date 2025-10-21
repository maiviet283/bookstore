import BookCard from "./BookCard";
import type { BookListItem } from "../../types/Book";

interface BookGridProps {
  books: BookListItem[];
}

export default function BookGrid({ books }: BookGridProps) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        Không có sách nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
