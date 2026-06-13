import { BLOG_CATEGORIES, SORT_OPTIONS } from "../constants/blogCategories";

const BlogFilters = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => (
  <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
    <input
      type="search"
      placeholder="Search blogs by title, content, or author..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
    />
    <select
      value={categoryFilter}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400"
    >
      <option value="">All Categories</option>
      {BLOG_CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
      className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-400"
    >
      <option value={SORT_OPTIONS.NEWEST}>Newest First</option>
      <option value={SORT_OPTIONS.POPULAR}>Most Popular</option>
      <option value={SORT_OPTIONS.OLDEST}>Oldest First</option>
    </select>
  </div>
);

export default BlogFilters;
