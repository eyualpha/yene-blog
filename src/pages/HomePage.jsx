import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";
import FeaturedCarousel from "../components/FeaturedCarousel";
import HeroSection from "../components/HeroSection";
import Footer, { Pagination } from "../components/Footer";
import Newsletter from "../components/Newsletter";
import TrendingTags from "../components/TrendingTags";
import { ARTICLES_PER_PAGE } from "../constants/blogCategories";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    blogs,
    allBlogs,
    loading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    tagFilter,
    setTagFilter,
  } = useBlogs();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(blogs.length / ARTICLES_PER_PAGE));

  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return blogs.slice(start, start + ARTICLES_PER_PAGE);
  }, [blogs, currentPage]);

  const featuredBlogs = useMemo(
    () =>
      [...allBlogs]
        .sort((a, b) => (b.views || 0) - (a.views || 0) || (b.likes || 0) - (a.likes || 0))
        .slice(0, 5),
    [allBlogs]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, tagFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="w-full bg-app min-h-screen">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      {!loading && featuredBlogs.length > 0 && (
        <FeaturedCarousel blogs={featuredBlogs} />
      )}

      <section id="articles" className="w-full max-w-6xl mx-auto px-4 pb-8">
        <TrendingTags
          blogs={allBlogs}
          activeTag={tagFilter}
          onTagSelect={setTagFilter}
        />

        <h2 className="text-2xl md:text-3xl font-bold text-app text-center mb-10">
          Articles
        </h2>

        {loading ? (
          <LoadingSpinner message="Loading articles..." />
        ) : (
          <>
            <BlogCard
              blogList={paginatedBlogs}
              highlightIndex={paginatedBlogs.length > 2 ? 2 : -1}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary mb-4">No articles yet.</p>
            <button
              onClick={() => navigate(user ? "/profile" : "/auth")}
              className="px-6 py-3 bg-accent hover-accent text-white font-semibold rounded-2xl transition hover:scale-105"
            >
              {user ? "Write the first article" : "Sign in to write"}
            </button>
          </div>
        )}
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default HomePage;
