import { Link } from "react-router-dom";
import { FiBookmark } from "react-icons/fi";
import { useBookmarks } from "../context/BookmarkContext";
import { useBlogs } from "../context/BlogContext";
import BlogCard from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";

const SavedPage = () => {
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();
  const { allBlogsRaw, loading: blogsLoading } = useBlogs();

  const savedArticles = bookmarks
    .map((bookmark) => {
      const live = allBlogsRaw.find((b) => b.id === (bookmark.blogId || bookmark.id));
      if (live) return live;
      return bookmark.blogId
        ? {
            id: bookmark.blogId,
            title: bookmark.title,
            coverImage: bookmark.coverImage,
            author: bookmark.author,
            category: bookmark.category,
            detail: "",
            createdAt: bookmark.savedAt,
          }
        : null;
    })
    .filter(Boolean);

  const loading = bookmarksLoading || blogsLoading;

  return (
    <div className="w-full bg-app min-h-screen pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center text-accent">
            <FiBookmark size={22} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-app">Reading List</h1>
            <p className="text-muted text-sm">
              {savedArticles.length} saved article{savedArticles.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your reading list..." />
        ) : savedArticles.length > 0 ? (
          <BlogCard blogList={savedArticles} />
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-app">
            <FiBookmark size={40} className="text-muted mx-auto mb-4" />
            <p className="text-app font-semibold mb-2">No saved articles yet</p>
            <p className="text-muted text-sm mb-6">
              Tap the bookmark icon on any article to save it for later.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded-2xl hover-accent transition"
            >
              Explore Articles
            </Link>
          </div>
        )}
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default SavedPage;
