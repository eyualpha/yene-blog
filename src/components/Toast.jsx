import { useEffect } from "react";

const Toast = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const styles = {
    success: "bg-emerald-600",
    info: "bg-accent",
    error: "bg-red-500",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] ${styles[type] || styles.error} text-white px-5 py-3.5 rounded-2xl shadow-app-lg max-w-sm text-sm font-medium animate-in fade-in slide-in-from-bottom-2`}
    >
      {message}
    </div>
  );
};

export default Toast;
