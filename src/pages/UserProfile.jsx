import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBlogs } from "../context/BlogContext";
import { BLOG_CATEGORIES } from "../constants/blogCategories";
import { BLOG_STATUS, parseTags, formatTagsForInput } from "../utils/blogFeatures";
import BlogCard from "../components/BlogCard";
import ImageUpload from "../components/ImageUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";

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
  const [category, setCategory] = useState("Technology");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState(BLOG_STATUS.PUBLISHED);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [removeCover, setRemoveCover] = useState(false);
  const [imageError, setImageError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "error" });

  const resetForm = () => {
    setTitle("");
    setDetail("");
    setCategory("Technology");
    setTagsInput("");
    setStatus(BLOG_STATUS.PUBLISHED);
    setCoverFile(null);
    setCoverPreview("");
    setRemoveCover(false);
    setImageError("");
    setEditingId(null);
  };

  const handleFileSelect = (file, error) => {
    setImageError(error || "");
    if (error) return;
    setCoverFile(file);
    setRemoveCover(false);
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    setRemoveCover(true);
    setImageError("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !detail.trim()) {
      setToast({ message: "Please fill in all fields.", type: "error" });
      return;
    }

    setSubmitting(true);
    setUploading(Boolean(coverFile));
    try {
      if (editingId) {
        await handleUpdateBlog(editingId, {
          title: title.trim(),
          detail: detail.trim(),
          category,
          tags: parseTags(tagsInput),
          status,
          coverFile,
          removeCover,
        });
        setToast({ message: "Article updated!", type: "success" });
      } else {
        await handleCreateBlog({
          title: title.trim(),
          detail: detail.trim(),
          category,
          tags: parseTags(tagsInput),
          status,
          coverFile,
        });
        setToast({
          message: status === BLOG_STATUS.DRAFT ? "Draft saved!" : "Article published!",
          type: "success",
        });
      }
      resetForm();
    } catch (err) {
      console.error("Error saving blog:", err);
      setToast({
        message: err.message || "Failed to save article.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setDetail(blog.detail);
    setCategory(blog.category || "Technology");
    setTagsInput(formatTagsForInput(blog.tags));
    setStatus(blog.status || BLOG_STATUS.PUBLISHED);
    setCoverFile(null);
    setCoverPreview(blog.coverImage || "");
    setRemoveCover(false);
    setImageError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await handleDeleteBlog(blogId);
      if (editingId === blogId) resetForm();
      setToast({ message: "Article deleted.", type: "success" });
    } catch (err) {
      console.error("Error deleting blog:", err);
      setToast({ message: "Failed to delete.", type: "error" });
    }
  };

  const handleLogOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="w-full bg-app min-h-screen pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
              alt={user?.displayName}
              className="w-14 h-14 rounded-full object-cover border-2 border-accent"
            />
            <div>
              <p className="text-xl font-bold text-app">{user?.displayName}</p>
              <p className="text-muted text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogOut}
              className="px-4 py-2 border border-app rounded-xl text-secondary hover:text-app hover:bg-elevated transition text-sm font-medium"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-app shadow-app p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-app mb-1">
            {editingId ? "Edit Article" : "Write New Article"}
          </h2>
          <p className="text-muted text-sm mb-6">
            Share your ideas with the YeneBlog community.
          </p>

          <div className="flex flex-col gap-4 max-w-2xl">
            <ImageUpload
              file={coverFile}
              previewUrl={!removeCover ? coverPreview : ""}
              onFileSelect={handleFileSelect}
              onRemove={handleRemoveCover}
              disabled={submitting}
              error={imageError}
            />

            <input
              type="text"
              value={title}
              placeholder="Article title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 bg-input border border-app rounded-2xl text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3.5 bg-input border border-app rounded-2xl text-app focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={tagsInput}
              placeholder="Tags (comma separated, e.g. react, firebase, tutorial)"
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-3.5 bg-input border border-app rounded-2xl text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStatus(BLOG_STATUS.PUBLISHED)}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold border transition ${
                  status === BLOG_STATUS.PUBLISHED
                    ? "bg-accent text-white border-accent"
                    : "border-app text-secondary hover:text-app"
                }`}
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => setStatus(BLOG_STATUS.DRAFT)}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold border transition ${
                  status === BLOG_STATUS.DRAFT
                    ? "bg-amber-500 text-white border-amber-500"
                    : "border-app text-secondary hover:text-app"
                }`}
              >
                Save as Draft
              </button>
            </div>
            <textarea
              value={detail}
              placeholder="Write your article content..."
              onChange={(e) => setDetail(e.target.value)}
              rows={10}
              className="w-full px-4 py-3.5 bg-input border border-app rounded-2xl text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y transition"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-accent hover-accent text-white font-semibold rounded-2xl transition disabled:opacity-50 hover:scale-[1.02]"
              >
                {submitting
                  ? uploading
                    ? "Uploading image..."
                    : "Saving..."
                  : editingId
                    ? "Update Article"
                    : status === BLOG_STATUS.DRAFT
                      ? "Save Draft"
                      : "Publish Article"}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-app rounded-2xl text-secondary hover:text-app hover:bg-elevated transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-app mb-6">
          Your Articles
          <span className="text-muted font-normal text-lg ml-2">({userBlogs.length})</span>
        </h2>

        {loading ? (
          <LoadingSpinner message="Loading your articles..." />
        ) : (
          <BlogCard
            blogList={userBlogs}
            showActions
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
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

export default UserProfile;
