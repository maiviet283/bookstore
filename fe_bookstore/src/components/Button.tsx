import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({ loading, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 ${props.className || ""}`}
      disabled={props.disabled || loading}
    >
      {loading ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : children}
    </button>
  );
}
