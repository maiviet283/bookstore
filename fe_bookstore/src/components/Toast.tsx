import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Toast = () => {
  const { message } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);

      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white cursor-pointer transition-opacity duration-300 ${
        message.type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message.text}
    </div>
  );
};

export default Toast;
