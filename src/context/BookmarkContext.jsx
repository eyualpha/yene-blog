import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  subscribeToBookmarks,
  addBookmark,
  removeBookmark,
  isBlogBookmarked,
} from "../services/bookmarkService";
import { useAuth } from "./AuthContext";

const BookmarkContext = createContext(null);

export const BookmarkProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToBookmarks(
      user.uid,
      (items) => {
        setBookmarks(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading bookmarks:", err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.map((b) => b.blogId || b.id)),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (blog) => {
      if (!user) throw new Error("Sign in to save articles.");

      const saved = bookmarkedIds.has(blog.id);
      if (saved) {
        await removeBookmark(user.uid, blog.id);
      } else {
        await addBookmark(user.uid, blog);
      }
    },
    [user, bookmarkedIds]
  );

  const isBookmarked = useCallback(
    (blogId) => bookmarkedIds.has(blogId),
    [bookmarkedIds]
  );

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, loading, toggleBookmark, isBookmarked, bookmarkedIds }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};

export { isBlogBookmarked };
