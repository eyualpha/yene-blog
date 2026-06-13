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
  getBlogById,
  subscribeToBlogs,
  toggleBlogLike,
  updateBlog,
} from "../services/blogService";
import { uploadBlogCover, deleteBlogCover } from "../services/imageService";
import { useAuth } from "./AuthContext";
import { SORT_OPTIONS } from "../constants/blogCategories";
import { BLOG_STATUS } from "../utils/blogFeatures";

const isPublished = (blog) =>
  !blog.status || blog.status === BLOG_STATUS.PUBLISHED;

const BlogContext = createContext(null);

export const BlogProvider = ({ children }) => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
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
    let result = blogs.filter(isPublished);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(query) ||
          blog.detail?.toLowerCase().includes(query) ||
          blog.author?.toLowerCase().includes(query) ||
          blog.tags?.some((t) => t.includes(query))
      );
    }

    if (categoryFilter) {
      result = result.filter((blog) => blog.category === categoryFilter);
    }

    if (tagFilter) {
      result = result.filter((blog) => blog.tags?.includes(tagFilter));
    }

    switch (sortBy) {
      case SORT_OPTIONS.POPULAR:
        result.sort((a, b) => (b.views || 0) - (a.views || 0) || (b.likes || 0) - (a.likes || 0));
        break;
      case SORT_OPTIONS.OLDEST:
        result.reverse();
        break;
      default:
        break;
    }

    return result;
  }, [blogs, searchQuery, categoryFilter, tagFilter, sortBy]);

  const publishedBlogs = useMemo(() => blogs.filter(isPublished), [blogs]);

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
    async ({ title, detail, category, coverFile, tags, status }) => {
      if (!user) throw new Error("You must be logged in to publish.");

      const blogId = await createBlog({
        title,
        detail,
        category: category || "Other",
        tags: tags || [],
        status: status || BLOG_STATUS.PUBLISHED,
        userId: user.uid,
        author: user.displayName || "Anonymous",
        authorId: user.uid,
        authorPhoto: user.photoURL || "",
        authorEmail: user.email || "",
      });

      if (coverFile) {
        const { url, publicId } = await uploadBlogCover(coverFile, user.uid, blogId);
        await updateBlog(blogId, {
          coverImage: url,
          coverImagePublicId: publicId,
          coverImagePath: "",
        });
      }

      return blogId;
    },
    [user]
  );

  const handleUpdateBlog = useCallback(
    async (blogId, { title, detail, category, coverFile, removeCover, tags, status }) => {
      const existing = blogs.find((b) => b.id === blogId) || (await getBlogById(blogId));
      const updates = { title, detail, category };
      if (tags !== undefined) updates.tags = tags;
      if (status !== undefined) updates.status = status;

      if (removeCover) {
        await deleteBlogCover();
        updates.coverImage = "";
        updates.coverImagePublicId = "";
        updates.coverImagePath = "";
      }

      if (coverFile) {
        await deleteBlogCover();
        const { url, publicId } = await uploadBlogCover(
          coverFile,
          existing?.userId || user.uid,
          blogId
        );
        updates.coverImage = url;
        updates.coverImagePublicId = publicId;
        updates.coverImagePath = "";
      }

      await updateBlog(blogId, updates);
    },
    [blogs, user]
  );

  const handleDeleteBlog = useCallback(async (blogId) => {
      await deleteBlogCover();
      await deleteBlog(blogId);
    }, []);

  return (
    <BlogContext.Provider
      value={{
        blogs: filteredBlogs,
        allBlogs: publishedBlogs,
        allBlogsRaw: blogs,
        userBlogs,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        tagFilter,
        setTagFilter,
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
