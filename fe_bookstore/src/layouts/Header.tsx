import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";


const Header = React.memo(() => {
  const location = useLocation();
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/about", label: "Giới thiệu" },
  ];

  const linkClass = (path: string) =>
    `block px-4 py-2 font-medium transition-colors ${location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-700 hover:text-indigo-600"
    }`;

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-indigo-700"
          >
            📚 <span>BookStore</span>
          </Link>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow">
            <svg
              className="animate-spin h-5 w-5 text-indigo-500"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              Đang kiểm tra đăng nhập...
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-6 py-3 md:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition"
        >
          📚 <span>BookStore</span>
        </Link>

        {/* Nút mở menu mobile */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className={linkClass(to)}>
              {label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            >
              Đăng nhập / Đăng ký
            </Link>
          ) : (
            <>
              <Link to="/cart" className={linkClass("/cart")}>
                🛒 Giỏ hàng
              </Link>
              <Link to="/account" className={linkClass("/account")}>
                👤 <b>{user?.username || "Tài khoản"}</b>
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Đăng xuất
              </button>
            </>
          )}
        </nav>
      </div>

      {/* --- MENU MOBILE (hiện dưới Header, có nút X và bấm ngoài để đóng) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Lớp nền mờ, bấm ra ngoài để đóng */}
            <motion.div
              className="fixed inset-0 bg-black/20 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu trượt xuống dưới header */}
            <motion.div
              className="absolute top-full left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg rounded-b-2xl overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              <div className="flex justify-between items-center px-6 py-3 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-indigo-700">📚 Menu</h2>
                <button
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2 py-4 px-6">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={linkClass(to)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}

                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-indigo-500 text-white text-center px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                  >
                    Đăng nhập / Đăng ký
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className={linkClass("/cart")}
                    >
                      🛒 Giỏ hàng
                    </Link>
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className={linkClass("/account")}
                    >
                      👤 {user?.username || "Tài khoản"}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition mt-2"
                    >
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </header>
  );
});

export default Header;
