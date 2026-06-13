import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createBlog,
  deleteBlog,
  subscribeToBlogs,
  toggleBlogLike,
  updateBlog,
} from "../services/blogService";
import { useAuth } from "./AuthContext";
import { SORT_OPTIONS } from "../constants/blogCategories";

const BlogContext = createContext(null);

export const BlogProvider = ({ children }) => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToBlogs(
      (fetchedBlogs) => {
        setBlogs(fetchedBlogs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(query) ||
          blog.detail?.toLowerCase().includes(query) ||
          blog.author?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter) {
      result = result.filter((blog) => blog.category === categoryFilter);
    }

    switch (sortBy) {
      case SORT_OPTIONS.POPULAR:
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case SORT_OPTIONS.OLDEST:
        result.reverse();
        break;
      default:
        break;
    }

    return result;
  }, [blogs, searchQuery, categoryFilter, sortBy]);

  const userBlogs = useMemo(
    () => (user ? blogs.filter((blog) => blog.userId === user.uid) : []),
    [blogs, user]
  );

  const handleLike = useCallback(
    async (blogId) => {
      if (!user) {
        throw new Error("You must be logged in to like a blog.");
      }

      const blog = blogs.find((b) => b.id === blogId);
      if (!blog) return;

      const isLiked = blog.likedBy?.includes(user.uid);
      await toggleBlogLike(blogId, user.uid, isLiked);
    },
    [blogs, user]
  );

  const handleCreateBlog = useCallback(
    async ({ title, detail, category }) => {
      if (!user) throw new Error("You must be logged in to publish.");
      await createBlog({
        title,
        detail,
        category: category || "Other",
        userId: user.uid,
        author: user.displayName || "Anonymous",
        authorId: user.uid,
        authorPhoto: user.photoURL || "",
        authorEmail: user.email || "",
      });
    },
    [user]
  );

  const handleUpdateBlog = useCallback(async (blogId, updates) => {
    await updateBlog(blogId, updates);
  }, []);

  const handleDeleteBlog = useCallback(async (blogId) => {
    await deleteBlog(blogId);
  }, []);

  return (
    <BlogContext.Provider
      value={{
        blogs: filteredBlogs,
        allBlogs: blogs,
        userBlogs,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        sortBy,
        setSortBy,
        handleLike,
        handleCreateBlog,
        handleUpdateBlog,
        handleDeleteBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogs = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogs must be used within a BlogProvider");
  }
  return context;
};
