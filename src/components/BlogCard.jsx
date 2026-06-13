import { Link } from "react-router-dom";
import { FiCalendar, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatDate";
import { BLOG_STATUS } from "../utils/blogFeatures";
import BlogCover from "./BlogCover";
import BookmarkButton from "./BookmarkButton";
import AuthorBadge from "./AuthorBadge";

const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length > maxLength) return text.substring(0, maxLength) + "...";
  return text;
};

const BlogCard = ({
  blogList,
  showActions = false,
  onEdit,
  onDelete,
  highlightIndex = -1,
}) => {
  const { user } = useAuth();

  if (!blogList || blogList.length === 0) {
    return (
      <p className="text-muted w-full text-center py-16 text-lg">
        No articles found. Try a different search or category.
      </p>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogList.map((blog, index) => (
        <ArticleCard
          key={blog.id}
          blog={blog}
          isHighlighted={index === highlightIndex}
          showActions={showActions && user?.uid === blog.userId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const ArticleCard = ({ blog, isHighlighted, showActions, onEdit, onDelete }) => {
  const isTrending = (blog.views || 0) >= 10 || (blog.likes || 0) >= 3;
  const isDraft = blog.status === BLOG_STATUS.DRAFT;
  const authorLink = `/author/${blog.authorId || blog.userId}`;

  return (
    <article className="group bg-card rounded-2xl overflow-hidden border border-app shadow-app hover:shadow-app-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative">
        <Link to={`/blog/${blog.id}`} className="block">
          <BlogCover blog={blog} className="h-48" />
        </Link>

        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <BookmarkButton blog={blog} size="sm" />
          {isDraft && (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-white">
              Draft
            </span>
          )}
        </div>

        {isTrending && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-orange-500/90 flex items-center justify-center shadow-lg z-10">
            <FaFire className="text-white" size={14} />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-accent-soft text-accent"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link to={`/blog/${blog.id}`}>
          <h2 className="text-lg font-bold text-app mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {blog.title}
          </h2>
          <p className="text-secondary text-sm line-clamp-2 mb-3 leading-relaxed">
            {truncateText(blog.detail, 100)}
          </p>
        </Link>

        <Link
          to={authorLink}
          className="text-xs text-muted hover:text-accent transition mb-3 inline-flex items-center"
        >
          by {blog.author}
          <AuthorBadge authorId={blog.authorId || blog.userId} />
        </Link>

        <div className="flex items-center gap-4 text-muted text-xs mt-auto mb-4">
          <span className="flex items-center gap-1.5">
            <FiCalendar size={13} />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <FiEye size={13} />
            {blog.views || 0}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/blog/${blog.id}`}
            className={`flex-1 text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isHighlighted
                ? "bg-accent text-white hover-accent"
                : "border border-app text-app hover:bg-accent hover:text-white hover:border-transparent"
            }`}
          >
            Read More
          </Link>

          {showActions && (
            <div className="flex gap-1">
              <button
                onClick={() => onEdit?.(blog)}
                className="w-9 h-9 rounded-xl border border-app flex items-center justify-center text-secondary hover:text-accent hover:border-accent transition"
                aria-label="Edit blog"
              >
                <FiEdit2 size={15} />
              </button>
              <button
                onClick={() => onDelete?.(blog.id)}
                className="w-9 h-9 rounded-xl border border-app flex items-center justify-center text-secondary hover:text-red-500 hover:border-red-500 transition"
                aria-label="Delete blog"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
