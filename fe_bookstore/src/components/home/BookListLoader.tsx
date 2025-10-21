import Loading from "../Loading";

interface Props {
  loading: boolean;
  loadingMore: boolean;
  nextUrl: string | null;
}

export default function BookListLoader({ loading, loadingMore, nextUrl }: Props) {
  if (loading) return <Loading />;

  if (loadingMore)
    return (
      <div className="text-center mt-6 text-indigo-500 font-medium">
        Đang tải thêm sách...
      </div>
    );

  if (!nextUrl)
    return (
      <div className="text-center mt-8 text-gray-400 text-sm">
        Bạn đã xem hết danh sách rồi.
      </div>
    );

  return null;
}
