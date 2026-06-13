import { useState } from "react";
import { FiMail } from "react-icons/fi";
import Toast from "./Toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setToast({ message: "Please enter a valid email.", type: "error" });
      return;
    }
    setToast({ message: "Thanks for subscribing!", type: "success" });
    setEmail("");
  };

  return (
    <section id="newsletter" className="w-full bg-surface border-y border-app py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-app mb-2">
          Subscribe For New Content
        </h2>
        <p className="text-secondary text-sm mb-8">
          Get the latest articles delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-11 pr-4 py-3.5 bg-input border border-app rounded-2xl text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-accent hover-accent text-white font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-app"
          >
            Subscribe
          </button>
        </form>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </section>
  );
};

export default Newsletter;
