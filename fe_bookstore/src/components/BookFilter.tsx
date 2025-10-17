import { useEffect, useState } from "react";
import { bookApi } from "../apis/bookApi";
import type { Category } from "../types/Category";

type Props = {
  onFilterChange: (filters: { category: string; order: "" | "desc" | "asc" }) => void;
};

export default function BookFilter({ onFilterChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [order, setOrder] = useState<"asc" | "desc" | "">("");

  useEffect(() => {
    bookApi.getCategories().then((res) => {
      if (res.status === "success") setCategories(res.data);
    });
  }, []);

  const handleApply = () => {
    onFilterChange({ category: selectedCategory, order });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white shadow p-4 rounded-2xl">
      <div>
        <label className="font-medium mr-2">Danh mục:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-2 py-1"
        >
          <option value="">Tất cả</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-medium mr-2">Sắp xếp theo giá:</label>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as "" | "desc" | "asc")}
          className="border rounded-lg px-2 py-1"
        >
          <option value="">------------</option>
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
      </div>

      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
      >
        Áp dụng
      </button>
    </div>
  );
}
