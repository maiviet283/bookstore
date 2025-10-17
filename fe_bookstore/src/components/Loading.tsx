import { Loader2 } from "lucide-react";

export default function Loading({ text = "Đang tải..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-600">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
