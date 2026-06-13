import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import BlogCover from "./BlogCover";

const RelatedArticles = ({ articles }) => {
  if (!articles?.length) return null;

  return (
    <section className="mt-10 pt-8 border-t border-app">
      <h2 className="text-xl font-bold text-app mb-5">Read Next</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/blog/${article.id}`}
            className="group bg-card rounded-2xl border border-app overflow-hidden hover:shadow-app-lg hover:-translate-y-0.5 transition-all"
          >
            <BlogCover blog={article} className="h-32" showAuthor={false} />
            <div className="p-4">
              <h3 className="text-sm font-semibold text-app line-clamp-2 group-hover:text-accent transition-colors">
                {article.title}
              </h3>
              <p className="text-muted text-xs mt-2">{formatDate(article.createdAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
