import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight, FiPenTool, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaTwitter, FaYoutube } from "react-icons/fa";
import { FILTER_CATEGORIES } from "../constants/blogCategories";
import { useBlogs } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";

const HeroSection = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allBlogs } = useBlogs();
  const categoryScrollRef = useRef(null);

  const stats = useMemo(() => {
    const authors = new Set(allBlogs.map((b) => b.authorId || b.author).filter(Boolean));
    return {
      articles: allBlogs.length,
      writers: authors.size,
      categories: FILTER_CATEGORIES.length - 1,
    };
  }, [allBlogs]);

  const scrollCategories = (dir) => {
    categoryScrollRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

  const scrollToArticles = () => {
    document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="hero-orb hero-orb-blue" />
        <div className="hero-orb hero-orb-purple" />
        <div className="hero-orb hero-orb-cyan" />
        <div className="hero-grid" />
        <div className="hero-fade-bottom" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-10 md:pb-14">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            Curated stories &amp; insights
          </span>
          <div className="flex gap-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              aria-label="Twitter"
            >
              <FaTwitter size={15} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-btn"
              aria-label="YouTube"
            >
              <FaYoutube size={15} />
            </a>
          </div>
        </div>

        {/* Headline block */}
        <div className="max-w-3xl">
          <h1 className="hero-title">
            Discover{" "}
            <span className="hero-gradient-text">Nice Articles</span>
            <br className="hidden sm:block" />
            {" "}Here
          </h1>
          <p className="hero-subtitle mt-5 md:mt-6">
            Explore thoughtful writing from creators worldwide — deep tech dives,
            design thinking, and everyday insights for every curious mind.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button onClick={scrollToArticles} className="hero-cta-primary">
              Explore Articles
              <FiArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate(user ? "/profile" : "/auth")}
              className="hero-cta-secondary"
            >
              <FiPenTool size={16} />
              {user ? "Start Writing" : "Join & Write"}
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 md:gap-10 mt-10 pt-8 border-t border-app">
            {[
              { value: stats.articles, label: "Articles" },
              { value: stats.writers || "—", label: "Writers" },
              { value: stats.categories, label: "Topics" },
            ].map(({ value, label }) => (
              <div key={label} className="hero-stat">
                <span className="hero-stat-value">{value}</span>
                <span className="hero-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search card */}
        <div className="hero-search-wrap mt-10 md:mt-12">
          <div className="hero-search-glow" aria-hidden="true" />
          <div className="hero-search-card">
            <div className="relative">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search articles, topics, or authors..."
                className="w-full pl-14 pr-5 py-4 md:py-5 bg-input border border-app rounded-2xl text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition text-base"
              />
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-6 relative">
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCategories(-1)}
              className="hero-cat-nav hidden sm:flex"
              aria-label="Scroll categories left"
            >
              <FiChevronLeft size={16} />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 py-1 px-0.5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {FILTER_CATEGORIES.map((cat) => {
                const isActive = cat === "All" ? !categoryFilter : categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat === "All" ? "" : cat)}
                    className={`hero-cat-pill flex-shrink-0 ${isActive ? "hero-cat-pill-active" : ""}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => scrollCategories(1)}
              className="hero-cat-nav hidden sm:flex"
              aria-label="Scroll categories right"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
