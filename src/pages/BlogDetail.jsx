import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useBlogs } from "../context/BlogContext";
import { getBlogById } from "../services/blogService";
import { subscribeToComments, addComment } from "../services/commentService";
import { formatDate } from "../utils/formatDate";
import { getReadingTime } from "../utils/readingTime";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";

const BlogDetail = () => {
  const navigate = useNavigate();
  const { id: blogId } = useParams();
  const { user } = useAuth();
  const { handleLike } = useBlogs();
  const [blog, setBlog] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "error" });

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const blogData = await getBlogById(blogId);
        setBlog(blogData);
        if (blogData && user) {
          setIsLiked(blogData.likedBy?.includes(user.uid) || false);
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
    setIsLiked((prev) => !prev);
    try {
      await handleLike(blogId);
      setBlog((prev) =>
        prev
          ? {
              ...prev,
              likes: isLiked ? (prev.likes || 1) - 1 : (prev.likes || 0) + 1,
            }
          : prev
      );
    } catch {
      setIsLiked((prev) => !prev);
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
      <div className="min-h-screen w-full flex items-center justify-center bg-[#191919] text-white">
        <LoadingSpinner message="Loading blog..." />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#191919] text-white gap-4">
        <p className="text-xl">Blog not found.</p>
        <Link to="/" className="text-blue-400 hover:underline flex items-center gap-2">
          <FaArrowLeft /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#191919] px-4 min-h-screen py-22">
      <div className="max-w-[800px] mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <FaArrowLeft /> Back to blogs
        </Link>

        <article className="flex flex-col p-6 bg-gray-900 rounded-lg shadow-lg text-white">
          {blog.category && (
            <span className="inline-block self-start text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded-full mb-4">
              {blog.category}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
            <img
              src={blog.authorPhoto || "https://via.placeholder.com/40"}
              alt={blog.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-gray-200 font-semibold">{blog.author}</p>
              <p className="text-gray-500 text-sm">
                {formatDate(blog.createdAt)} · {getReadingTime(blog.detail)}
              </p>
            </div>
          </div>

          <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap mb-6">
            {blog.detail}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onLike}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              {isLiked && user ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-400" />
              )}
              <span>{blog.likes || 0} likes</span>
            </button>
          </div>

          <section className="w-full bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Comments ({commentList.length})
            </h2>

            {commentList.length > 0 ? (
              <div className="space-y-4 mb-6">
                {commentList.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center mb-2">
                      <img
                        src={comment.userPhoto || "https://via.placeholder.com/32"}
                        alt={comment.userName}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                      <p className="text-gray-300 font-semibold">{comment.userName}</p>
                    </div>
                    <p className="text-gray-200 ml-10">{comment.text}</p>
                    <p className="text-gray-500 text-xs ml-10 mt-1">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4 mb-4">
                No comments yet. Be the first to comment!
              </p>
            )}

            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Write a comment..." : "Log in to comment..."}
                disabled={!user || submitting}
                rows={3}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 disabled:opacity-50"
              />
              <button
                onClick={handleAddComment}
                disabled={!user || submitting || !newComment.trim()}
                className="mt-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Posting..." : "Add Comment"}
              </button>
            </div>
          </section>
        </article>
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
