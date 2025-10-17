import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/books", label: "Books" },
    { to: "/login", label: "Login" },
    { to: "/cart", label: "Cart" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors"
        >
          📚 <span>BookStore</span>
        </Link>

        <nav className="flex gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-gray-700 font-medium hover:text-indigo-600 transition-colors ${
                location.pathname === to ? "text-indigo-600 font-semibold" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
