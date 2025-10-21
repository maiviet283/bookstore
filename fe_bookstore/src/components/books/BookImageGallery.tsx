import { useState } from "react";
import { BASE_URL } from "../../config";
import type { BookDetail } from "../../types/Book";

interface BookImageGalleryProps {
  book: BookDetail;
}

export default function BookImageGallery({ book }: BookImageGalleryProps) {
  const [mainImage, setMainImage] = useState<string>(`${BASE_URL}${book.image}`);

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <img
          src={mainImage}
          alt={book.name}
          className="rounded-2xl shadow-xl w-80 h-96 object-cover border border-gray-200 group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
          {book.category?.name}
        </span>
      </div>

      {book.images.length > 0 && (
        <div className="flex gap-3 mt-5 overflow-x-auto pb-2">
          {book.images.map((img) => (
            <img
              key={img.id}
              src={`${BASE_URL}${img.image}`}
              alt={img.alt}
              className={`w-20 h-24 object-cover rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                mainImage === `${BASE_URL}${img.image}`
                  ? "border-indigo-500 shadow-md scale-105"
                  : "border-gray-200 hover:border-indigo-400"
              }`}
              onClick={() => setMainImage(`${BASE_URL}${img.image}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
