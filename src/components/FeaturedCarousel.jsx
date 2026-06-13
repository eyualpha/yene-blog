import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCategoryStyle } from "../utils/categoryImages";
import BlogCover from "./BlogCover";

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

        <div className="hidden md:flex flex-1 items-stretch relative overflow-hidden">
          {blog.coverImage ? (
            <>
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />
            </>
          ) : (
            <>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-30`}
              />
              <span className="text-8xl md:text-9xl opacity-60 select-none z-10 m-auto">
                {style.emoji}
              </span>
            </>
          )}
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

export default FeaturedCarousel;
