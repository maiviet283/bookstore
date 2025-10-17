export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-center py-4 text-sm text-gray-600 shadow-inner">
      <p>
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-indigo-700">BookStore</span>. All
        rights reserved.
      </p>
    </footer>
  );
}
