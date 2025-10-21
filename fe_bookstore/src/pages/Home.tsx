import { useBooks } from "../hooks/useBooks";
import BookGrid from "../components/home/BookGrid";
import BookListLoader from "../components/home/BookListLoader";

export default function Home() {
  const { books, nextUrl, loading, loadingMore } = useBooks();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Danh sách Sách
      </h2>

      <BookGrid books={books} />
      <BookListLoader loading={loading} loadingMore={loadingMore} nextUrl={nextUrl} />
    </div>
  );
}
