import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Footer = () => {
  const links = ["Home", "Blog", "Write", "About"];

  return (
    <footer className="w-full bg-app border-t border-app py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
            Y
          </div>
          <span className="font-bold text-lg text-app">
            Yene<span className="text-accent">Blog</span>
          </span>
        </Link>

        <nav className="flex flex-wrap justify-center gap-6">
          {links.map((label) => (
            <Link
              key={label}
              to={label === "Home" ? "/" : label === "Write" ? "/profile" : "/#articles"}
              className="text-secondary hover:text-app text-sm transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-muted text-sm">
          © {new Date().getFullYear()} YeneBlog. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full border border-app flex items-center justify-center text-secondary hover:text-app hover:border-strong disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="Previous page"
      >
        <FiChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
            currentPage === page
              ? "border-2 border-app text-app bg-elevated"
              : "text-muted hover:text-app"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full bg-accent hover-accent text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition hover:scale-105"
        aria-label="Next page"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};
