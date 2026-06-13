export const BLOG_STATUS = {
  PUBLISHED: "published",
  DRAFT: "draft",
};

export const parseTags = (input) => {
  if (!input?.trim()) return [];
  return [...new Set(
    input
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0 && t.length <= 24)
  )].slice(0, 5);
};

export const formatTagsForInput = (tags) =>
  Array.isArray(tags) ? tags.join(", ") : "";

export const getTrendingTags = (blogs, limit = 8) => {
  const counts = {};
  blogs
    .filter((b) => b.status !== BLOG_STATUS.DRAFT)
    .forEach((blog) => {
      blog.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
};

export const getRelatedArticles = (blog, allBlogs, limit = 3) => {
  if (!blog) return [];

  return allBlogs
    .filter((b) => b.id !== blog.id && b.status !== BLOG_STATUS.DRAFT)
    .map((b) => {
      const sharedTags = b.tags?.filter((t) => blog.tags?.includes(t)).length || 0;
      const sameCategory = b.category === blog.category ? 2 : 0;
      return { ...b, score: sameCategory + sharedTags };
    })
    .filter((b) => b.score > 0)
    .sort((a, b) => b.score - a.score || (b.views || 0) - (a.views || 0))
    .slice(0, limit);
};
