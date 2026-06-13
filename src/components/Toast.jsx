import { useEffect } from "react";

const Toast = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "info"
        ? "bg-blue-600"
        : "bg-red-500";

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm`}
    >
      {message}
    </div>
  );
};

export default Toast;
