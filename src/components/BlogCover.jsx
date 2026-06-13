import { getCategoryStyle } from "../utils/categoryImages";

const BlogCover = ({ blog, className = "h-48", showAuthor = true, overlay = "dark" }) => {
  const style = getCategoryStyle(blog.category);
  const hasImage = Boolean(blog.coverImage);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {hasImage ? (
        <>
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className={`absolute inset-0 ${
              overlay === "light"
                ? "bg-gradient-to-t from-black/50 via-transparent to-transparent"
                : "bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            }`}
          />
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
          <span className="text-6xl opacity-40 select-none">{style.emoji}</span>
        </div>
      )}

      {showAuthor && (
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 dark:bg-black/80 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 shadow-app z-10">
          <img
            src={blog.authorPhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=author"}
            alt={blog.author}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-xs font-semibold text-gray-800 dark:text-white truncate max-w-[120px]">
            {blog.author}
          </span>
        </div>
      )}
    </div>
  );
};

export default BlogCover;
