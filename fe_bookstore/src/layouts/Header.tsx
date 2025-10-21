import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, loading } = useAuth();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
  ];

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors"
          >
            📚 <span>BookStore</span>
          </Link>
          <nav className="flex items-center gap-3 bg-gray-100 p-3 rounded-md shadow-md">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-gray-700 font-medium">Đang kiểm tra đăng nhập...</span>
          </nav>

        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors"
        >
          📚 <span>BookStore</span>
        </Link>

        <nav className="flex gap-8 items-center">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-gray-700 font-medium hover:text-indigo-600 transition-colors ${location.pathname === to ? "text-indigo-600 font-semibold" : ""
                }`}
            >
              {label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 transition"
            >
              Login / Register
            </Link>
          ) : (
            <>
              <Link
                to="/cart"
                className={`text-gray-700 font-medium hover:text-indigo-600 transition-colors ${location.pathname === "/cart" ? "text-indigo-600 font-semibold" : ""
                  }`}
              >
                🛒 Cart
              </Link>

              <Link
                to="/account"
                className={`text-gray-700 font-medium hover:text-indigo-600 transition-colors ${location.pathname === "/account" ? "text-indigo-600 font-semibold" : ""
                  }`}
              >
                👤 <b>{user?.username || "Account"}</b>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
