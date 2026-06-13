import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaTwitter, FaYoutube } from "react-icons/fa";
import { FILTER_CATEGORIES } from "../constants/blogCategories";
import { getCategoryStyle } from "../utils/categoryImages";
import { formatDate } from "../utils/formatDate";

const FeaturedCarousel = ({ blogs }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const featured = blogs.slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const goTo = useCallback(
    (index) => setActiveIndex((index + featured.length) % featured.length),
    [featured.length]
  );

  if (!featured.length) return null;

  const blog = featured[activeIndex];
  const style = getCategoryStyle(blog.category);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-12">
      <div
        className="relative overflow-hidden rounded-3xl shadow-app-lg min-h-[280px] md:min-h-[320px] flex items-stretch"
        style={{
          background: `linear-gradient(135deg, var(--featured-from) 0%, var(--featured-to) 100%)`,
        }}
      >
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <img
              src={blog.authorPhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=author"}
              alt={blog.author}
              className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
            />
            <span
              className="text-sm font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm"
              style={{ color: "var(--featured-text)" }}
            >
              {blog.author}
            </span>
          </div>

          <h2
            className="text-2xl md:text-3xl font-bold mb-3 leading-tight"
            style={{ color: "var(--featured-text)" }}
          >
            {blog.title}
          </h2>

          <p
            className="text-sm md:text-base mb-5 line-clamp-2 opacity-80"
            style={{ color: "var(--featured-text)" }}
          >
            {blog.detail?.slice(0, 160)}
            {blog.detail?.length > 160 ? "..." : ""}
          </p>

          <Link
            to={`/blog/${blog.id}`}
            className="inline-flex self-start items-center gap-1 text-sm font-semibold px-5 py-2.5 rounded-full bg-accent text-white hover-accent transition hover:scale-105"
          >
            Read More →
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-30`}
          />
          <span className="text-8xl md:text-9xl opacity-60 select-none z-10">
            {style.emoji}
          </span>
        </div>
      </div>

      {featured.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-accent"
                  : "w-2 bg-muted hover:bg-secondary"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export const HeroSection = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}) => (
  <section className="w-full max-w-6xl mx-auto px-4 pt-28 pb-8">
    <div className="flex justify-between items-start mb-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold text-app leading-tight mb-3">
          Discover Nice Articles Here
        </h1>
        <p className="text-secondary text-sm md:text-base max-w-lg">
          Explore articles crafted by passionate writers. From deep tech dives to
          everyday insights — there is something for every curious mind.
        </p>
      </div>

      <div className="hidden sm:flex gap-2 mt-2">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-elevated border border-app flex items-center justify-center text-secondary hover:text-accent hover:border-accent transition"
          aria-label="Twitter"
        >
          <FaTwitter size={16} />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-elevated border border-app flex items-center justify-center text-secondary hover:text-red-500 hover:border-red-500 transition"
          aria-label="YouTube"
        >
          <FaYoutube size={16} />
        </a>
      </div>
    </div>

    <div className="relative mb-6">
      <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search..."
        className="w-full pl-14 pr-5 py-4 bg-input border border-app rounded-2xl text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition shadow-app"
      />
    </div>

    <div className="flex flex-wrap gap-2 md:gap-3">
      {FILTER_CATEGORIES.map((cat) => {
        const isActive =
          cat === "All" ? !categoryFilter : categoryFilter === cat;
        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat === "All" ? "" : cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-accent text-white shadow-app hover-accent"
                : "text-secondary hover:text-app hover:bg-elevated"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  </section>
);

export default FeaturedCarousel;
