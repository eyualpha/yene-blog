import { FiBookmark } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookmarks } from "../context/BookmarkContext";

const BookmarkButton = ({ blog, size = "md" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(blog.id);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      await toggleBookmark(blog);
    } catch (err) {
      console.error(err);
    }
  };

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove bookmark" : "Save article"}
      className={`${sizeClasses} rounded-full flex items-center justify-center border transition-all ${
        saved
          ? "bg-accent text-white border-accent"
          : "bg-card/90 backdrop-blur-sm border-app text-secondary hover:text-accent hover:border-accent"
      }`}
    >
      {saved ? <FaBookmark size={iconSize} /> : <FiBookmark size={iconSize} />}
    </button>
  );
};

export default BookmarkButton;
