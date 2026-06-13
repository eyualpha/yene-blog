import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatDate";
import { getReadingTime } from "../utils/readingTime";

const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const BlogCard = ({ blogList, handleLike, showActions = false, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [likedBlogs, setLikedBlogs] = useState({});

  useEffect(() => {
    const initialLikedState = {};
    blogList.forEach((blog) => {
      initialLikedState[blog.id] =
        user && blog.likedBy?.includes(user.uid);
    });
    setLikedBlogs(initialLikedState);
  }, [blogList, user]);

  const handleLikeClick = useCallback(
    async (e, blogId) => {
      e.preventDefault();
      e.stopPropagation();

      if (!handleLike) return;

      setLikedBlogs((prev) => ({
        ...prev,
        [blogId]: !prev[blogId],
      }));

      try {
        await handleLike(blogId);
      } catch {
        setLikedBlogs((prev) => ({
          ...prev,
          [blogId]: !prev[blogId],
        }));
      }
    },
    [handleLike]
  );

  if (!blogList || blogList.length === 0) {
    return <p className="text-gray-400 w-full text-center py-8">No blogs found.</p>;
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-8">
      {blogList.map((blog) => (
        <article
          key={blog.id}
          className="border border-gray-600 p-4 rounded-lg flex flex-col bg-gray-900 hover:border-gray-400 transition duration-300"
        >
          <Link to={`/blog/${blog.id}`} className="flex flex-col flex-1">
            <div className="flex items-center mb-3">
              <img
                src={blog.authorPhoto || "https://via.placeholder.com/32"}
                alt={blog.author}
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
              <div className="flex flex-col min-w-0">
                <p className="text-gray-300 font-semibold truncate">{blog.author}</p>
                <p className="text-gray-500 text-xs truncate">{blog.authorEmail}</p>
              </div>
            </div>

            {blog.category && (
              <span className="inline-block self-start text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full mb-2">
                {blog.category}
              </span>
            )}

            <h2 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h2>
            <p className="text-gray-400 text-sm flex-1 line-clamp-3">
              {truncateText(blog.detail, 120)}
            </p>
          </Link>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
            <div className="text-gray-500 text-xs">
              <p>{formatDate(blog.createdAt)}</p>
              <p>{getReadingTime(blog.detail)}</p>
            </div>

            <div className="flex items-center gap-2">
              {showActions && user?.uid === blog.userId && (
                <>
                  <button
                    onClick={() => onEdit?.(blog)}
                    className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(blog.id)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                  >
                    Delete
                  </button>
                </>
              )}

              {handleLike && (
                <button
                  onClick={(e) => handleLikeClick(e, blog.id)}
                  className="cursor-pointer flex items-center text-white"
                  aria-label="Like blog"
                >
                  {likedBlogs[blog.id] && user ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400" />
                  )}
                  <span className="text-gray-400 font-semibold ml-2">
                    {blog.likes || 0}
                  </span>
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogCard;
