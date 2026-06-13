import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useBlogs } from "../context/BlogContext";
import { BLOG_STATUS } from "../utils/blogFeatures";
import BlogCard from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";

const AuthorPage = () => {
  const { authorId } = useParams();
  const { allBlogsRaw, loading } = useBlogs();

  const authorArticles = useMemo(
    () =>
      allBlogsRaw.filter(
        (b) =>
          (b.authorId === authorId || b.userId === authorId) &&
          (!b.status || b.status === BLOG_STATUS.PUBLISHED)
      ),
    [allBlogsRaw, authorId]
  );

  const author = authorArticles[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center pt-20">
        <LoadingSpinner message="Loading author..." />
      </div>
    );
  }

  return (
    <div className="w-full bg-app min-h-screen pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-secondary hover:text-app mb-8 text-sm"
        >
          <FiArrowLeft size={16} /> Back to articles
        </Link>

        {author ? (
          <div className="flex items-center gap-5 mb-10 p-6 bg-card rounded-3xl border border-app shadow-app">
            <img
              src={author.authorPhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=author"}
              alt={author.author}
              className="w-20 h-20 rounded-full object-cover border-2 border-accent"
            />
            <div>
              <h1 className="text-2xl font-bold text-app">{author.author}</h1>
              <p className="text-muted text-sm mt-1">{author.authorEmail}</p>
              <p className="text-secondary text-sm mt-2">
                {authorArticles.length} published article{authorArticles.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-app text-xl mb-8">Author not found.</p>
        )}

        {authorArticles.length > 0 ? (
          <BlogCard blogList={authorArticles} />
        ) : (
          <p className="text-muted text-center py-12">No published articles from this author.</p>
        )}
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AuthorPage;
