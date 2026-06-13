import { getTrendingTags } from "../utils/blogFeatures";

const TrendingTags = ({ blogs, activeTag, onTagSelect }) => {
  const trending = getTrendingTags(blogs);
  if (!trending.length) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-8">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
        Trending Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {activeTag && (
          <button
            onClick={() => onTagSelect("")}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-elevated text-secondary hover:text-app border border-app transition"
          >
            ✕ Clear tag
          </button>
        )}
        {trending.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => onTagSelect(activeTag === tag ? "" : tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              activeTag === tag
                ? "bg-accent text-white"
                : "bg-elevated text-secondary hover:text-app border border-app"
            }`}
          >
            #{tag}
            <span className="ml-1 opacity-60">({count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTags;
