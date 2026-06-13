import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";
import BlogFilters from "../components/BlogFilters";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    blogs,
    loading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    handleLike,
  } = useBlogs();
  const [toast, setToast] = useState({ message: "", type: "error" });

  const onLike = async (blogId) => {
    if (!user) {
      setToast({ message: "Please log in to like posts.", type: "info" });
      return;
    }
    try {
      await handleLike(blogId);
    } catch {
      setToast({ message: "Failed to update like.", type: "error" });
    }
  };

  return (
    <div className="w-full bg-[#191919] text-white min-h-screen">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center px-4 py-25">
        <div className="flex flex-col items-center text-center mt-10 gap-6 py-10">
          <p className="bg-gray-400 text-lg text-black px-6 py-2 rounded-full">
            Begin your journey toward deeper knowledge
          </p>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl">
            Discover Fresh Insights, Stories, and Ideas
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
            Explore articles crafted by passionate writers. From deep tech dives
            to everyday insights — there is something for every curious mind.
          </p>
          <button
            onClick={() => navigate(user ? "/profile" : "/auth")}
            className="text-black bg-white hover:bg-gray-300 px-6 py-3 rounded-lg transition duration-300 text-lg font-medium"
          >
            {user ? "Publish Your Blog" : "Sign In to Publish"}
          </button>
        </div>

        <div className="w-full mt-8">
          <h2 className="text-3xl font-bold mb-6">Explore Our Latest Blogs</h2>
          <BlogFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {loading ? (
            <LoadingSpinner message="Loading blogs..." />
          ) : (
            <BlogCard blogList={blogs} handleLike={onLike} />
          )}
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
    </div>
  );
};

export default HomePage;
