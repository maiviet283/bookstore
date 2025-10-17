import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-indigo-600" />
        </div>

        <h1 className="text-7xl font-extrabold text-indigo-700 mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Không tìm thấy trang</h2>
        <p className="mb-6 text-gray-500">
          Trang bạn đang cố truy cập không tồn tại hoặc đã bị di chuyển.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition duration-200"
        >
          ← Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
