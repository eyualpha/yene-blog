import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiEye, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useBlogs } from "../context/BlogContext";
import { getBlogById, incrementBlogViews } from "../services/blogService";
import { subscribeToComments, addComment } from "../services/commentService";
import { formatDate } from "../utils/formatDate";
import { getReadingTime } from "../utils/readingTime";
import { getRelatedArticles, BLOG_STATUS } from "../utils/blogFeatures";
import BlogCover from "../components/BlogCover";
import BookmarkButton from "../components/BookmarkButton";
import ShareButton from "../components/ShareButton";
import ReadingProgress from "../components/ReadingProgress";
import RelatedArticles from "../components/RelatedArticles";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import Footer from "../components/Footer";

const BlogDetail = () => {
  const navigate = useNavigate();
  const { id: blogId } = useParams();
  const { user } = useAuth();
  const { handleLike, allBlogsRaw } = useBlogs();
  const [blog, setBlog] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "error" });

  const relatedArticles = useMemo(
    () => getRelatedArticles(blog, allBlogsRaw),
    [blog, allBlogsRaw]
  );

  useEffect(() => {
    document.title = blog?.title ? `${blog.title} — YeneBlog` : "YeneBlog";
    return () => {
      document.title = "YeneBlog";
    };
  }, [blog?.title]);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const blogData = await getBlogById(blogId);
        setBlog(blogData);
        if (blogData && user) {
          setIsLiked(blogData.likedBy?.includes(user.uid) || false);
        }
        if (blogData && blogData.status !== BLOG_STATUS.DRAFT) {
          const counted = await incrementBlogViews(blogId);
          if (counted) {
            setBlog((prev) =>
              prev ? { ...prev, views: (prev.views || 0) + 1 } : prev
            );
          }
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setToast({ message: "Failed to load blog.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId, user]);

  useEffect(() => {
    const unsubscribe = subscribeToComments(
      blogId,
      setCommentList,
      (err) => console.error("Error fetching comments:", err)
    );
    return unsubscribe;
  }, [blogId]);

  const onLike = async () => {
    if (!user) {
      setToast({ message: "Please log in to like posts.", type: "info" });
      return;
    }
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    try {
      await handleLike(blogId);
      setBlog((prev) =>
        prev
          ? { ...prev, likes: wasLiked ? (prev.likes || 1) - 1 : (prev.likes || 0) + 1 }
          : prev
      );
    } catch {
      setIsLiked(wasLiked);
      setToast({ message: "Failed to update like.", type: "error" });
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      setToast({ message: "Please log in to comment.", type: "info" });
      navigate("/auth");
      return;
    }
    if (!newComment.trim()) {
      setToast({ message: "Comment cannot be empty.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      await addComment(blogId, {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || "",
        text: newComment.trim(),
      });
      setNewComment("");
      setToast({ message: "Comment added!", type: "success" });
    } catch (err) {
      console.error("Error adding comment:", err);
      setToast({ message: "Failed to add comment.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-app">
        <LoadingSpinner message="Loading article..." />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-app gap-4 pt-20">
        <p className="text-xl text-app">Article not found.</p>
        <Link to="/" className="text-accent hover:underline flex items-center gap-2">
          <FiArrowLeft /> Back to home
        </Link>
      </div>
    );
  }

  const isOwner = user?.uid === blog.userId;
  const isDraft = blog.status === BLOG_STATUS.DRAFT;

  if (isDraft && !isOwner) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-app gap-4 pt-20">
        <p className="text-xl text-app">This article is not published yet.</p>
        <Link to="/" className="text-accent hover:underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-app min-h-screen pt-24 pb-8">
      <ReadingProgress />

      <div className="max-w-3xl mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-secondary hover:text-app mb-8 transition text-sm font-medium"
        >
          <FiArrowLeft size={16} /> Back to articles
        </Link>

        <div className="relative mb-8">
          <BlogCover
            blog={blog}
            className="h-56 md:h-80 rounded-3xl shadow-app-lg"
            showAuthor={false}
            overlay="light"
          />
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <BookmarkButton blog={blog} />
            <ShareButton title={blog.title} />
          </div>
        </div>

        <article className="bg-card rounded-3xl border border-app shadow-app p-6 md:p-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.category && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-soft text-accent">
                {blog.category}
              </span>
            )}
            {isDraft && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-500/20 text-amber-500">
                Draft — only you can see this
              </span>
            )}
            {blog.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1 rounded-full bg-elevated text-secondary"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-app mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-app">
            <Link
              to={`/author/${blog.authorId || blog.userId}`}
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <img
                src={blog.authorPhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=author"}
                alt={blog.author}
                className="w-11 h-11 rounded-full object-cover border-2 border-app"
              />
              <div>
                <p className="text-app font-semibold">{blog.author}</p>
                <div className="flex items-center gap-3 text-muted text-xs mt-0.5">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} />
                    {formatDate(blog.createdAt)}
                  </span>
                  <span>{getReadingTime(blog.detail)}</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3 ml-auto">
              <span className="flex items-center gap-1.5 text-muted text-sm">
                <FiEye size={14} />
                {blog.views || 0} views
              </span>
              <button
                onClick={onLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isLiked && user
                    ? "bg-red-500/15 text-red-500 border border-red-500/30"
                    : "bg-elevated border border-app text-secondary hover:text-red-500 hover:border-red-500/30"
                }`}
              >
                {isLiked && user ? <FaHeart size={14} /> : <FiHeart size={14} />}
                {blog.likes || 0}
              </button>
            </div>
          </div>

          <div className="text-secondary text-base md:text-lg leading-relaxed whitespace-pre-wrap mb-10">
            {blog.detail}
          </div>

          <RelatedArticles articles={relatedArticles} />

          <section className="bg-elevated rounded-2xl p-5 md:p-6 border border-app mt-10">
            <h2 className="text-xl font-bold text-app mb-5">
              Comments ({commentList.length})
            </h2>

            {commentList.length > 0 ? (
              <div className="space-y-4 mb-6">
                {commentList.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-card rounded-xl border border-app">
                    <img
                      src={comment.userPhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=comment"}
                      alt={comment.userName}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-app font-semibold text-sm">{comment.userName}</p>
                        <span className="text-muted text-xs">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-secondary text-sm leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-6 mb-4 text-sm">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}

            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Write a comment..." : "Sign in to comment..."}
                disabled={!user || submitting}
                rows={3}
                className="w-full p-4 bg-input border border-app rounded-2xl text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50 resize-none text-sm"
              />
              <button
                onClick={handleAddComment}
                disabled={!user || submitting || !newComment.trim()}
                className="mt-3 px-6 py-2.5 bg-accent hover-accent text-white font-semibold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                {submitting ? "Posting..." : "Add Comment"}
              </button>
            </div>
          </section>
        </article>
      </div>

      <div className="mt-12">
        <Footer />
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
    </div>
  );
};

export default BlogDetail;
