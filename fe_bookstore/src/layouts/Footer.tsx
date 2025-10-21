export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-t border-gray-200 text-center py-6 text-gray-700 shadow-lg">
      <p className="text-sm md:text-base">
        © {new Date().getFullYear()}{" "}
        <span className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
          BookStore
        </span>
        . All rights reserved.
      </p>
      <div className="mt-2 flex justify-center gap-4">
        <a
          href="#"
          className="text-gray-500 hover:text-indigo-600 transition-colors duration-300"
        >
          Privacy
        </a>
        <a
          href="#"
          className="text-gray-500 hover:text-indigo-600 transition-colors duration-300"
        >
          Terms
        </a>
        <a
          href="#"
          className="text-gray-500 hover:text-indigo-600 transition-colors duration-300"
        >
          Contact
        </a>
      </div>
    </footer>
  );
}
