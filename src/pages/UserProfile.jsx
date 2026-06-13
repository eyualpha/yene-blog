import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBlogs } from "../context/BlogContext";
import { BLOG_CATEGORIES } from "../constants/blogCategories";
import BlogCard from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    userBlogs,
    loading,
    handleCreateBlog,
    handleUpdateBlog,
    handleDeleteBlog,
  } = useBlogs();

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("Other");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "error" });

  const resetForm = () => {
    setTitle("");
    setDetail("");
    setCategory("Other");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !detail.trim()) {
      setToast({ message: "Please fill in all fields.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await handleUpdateBlog(editingId, {
          title: title.trim(),
          detail: detail.trim(),
          category,
        });
        setToast({ message: "Blog updated successfully!", type: "success" });
      } else {
        await handleCreateBlog({
          title: title.trim(),
          detail: detail.trim(),
          category,
        });
        setToast({ message: "Blog published successfully!", type: "success" });
      }
      resetForm();
    } catch (err) {
      console.error("Error saving blog:", err);
      setToast({ message: "Failed to save blog.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setDetail(blog.detail);
    setCategory(blog.category || "Other");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await handleDeleteBlog(blogId);
      if (editingId === blogId) resetForm();
      setToast({ message: "Blog deleted.", type: "success" });
    } catch (err) {
      console.error("Error deleting blog:", err);
      setToast({ message: "Failed to delete blog.", type: "error" });
    }
  };

  const handleLogOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="flex flex-col items-center w-full bg-[#191919] text-white p-4 min-h-screen py-22">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center w-full px-4">
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-3">
            <img
              src={user?.photoURL || "https://via.placeholder.com/48"}
              alt={user?.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold">{user?.displayName}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            className="bg-gray-300 text-black hover:bg-gray-100 px-4 py-2 rounded cursor-pointer"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        </div>

        <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingId ? "Edit Blog" : "Publish New Blog"}
          </h2>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={title}
              placeholder="Blog title"
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-600 bg-gray-800 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-600 bg-gray-800 rounded p-3 text-white focus:outline-none focus:border-gray-400"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <textarea
              value={detail}
              placeholder="Write your blog content..."
              onChange={(e) => setDetail(e.target.value)}
              rows={8}
              className="border border-gray-600 bg-gray-800 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 resize-y"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update Blog"
                    : "Publish Blog"}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="border border-gray-600 px-6 py-2 rounded hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 self-start">
          Your Blogs ({userBlogs.length})
        </h2>

        {loading ? (
          <LoadingSpinner message="Loading your blogs..." />
        ) : (
          <BlogCard
            blogList={userBlogs}
            showActions
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
    </div>
  );
};

export default UserProfile;
