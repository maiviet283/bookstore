import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

const CategoryFilter = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentCategory = searchParams.get("category") || "";

  useEffect(() => {
    api
      .get("books/categories/")
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = (slug) => {
    navigate(`/?category=${slug}`);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => handleSelect("")}
        className={`px-4 py-2 rounded-full border ${
          !currentCategory ? "bg-blue-600 text-white" : "bg-white"
        }`}
      >
        Tất cả
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.slug)}
          className={`px-4 py-2 rounded-full border ${
            currentCategory === cat.slug ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
