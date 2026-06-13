import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiBookmark } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useBookmarks } from "../context/BookmarkContext";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Blog", path: "/#articles" },
  { label: "Saved", path: "/saved", auth: true },
  { label: "Write", path: "/profile", auth: true },
];

const NavBar = () => {
  const { user, logout } = useAuth();
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (link) => {
    if (link.auth && !user) {
      navigate("/auth");
      return;
    }
    if (link.path.startsWith("/#")) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(link.path.slice(2))?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById(link.path.slice(2))?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(link.path);
    }
  };

  return (
    <header className="w-full bg-nav backdrop-blur-md fixed top-0 left-0 z-50 border-b border-app">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg shadow-app group-hover:scale-105 transition-transform">
            Y
          </div>
          <span className="font-bold text-xl tracking-tight text-app">
            Yene<span className="text-accent">Blog</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className="text-secondary hover:text-app text-sm font-medium transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />

          {user ? (
            <>
              <Link
                to="/saved"
                className="relative w-10 h-10 rounded-full bg-elevated border border-app flex items-center justify-center text-secondary hover:text-accent hover:border-accent transition"
                aria-label="Reading list"
              >
                <FiBookmark size={18} />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                    {bookmarks.length > 9 ? "9+" : bookmarks.length}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-accent ring-2 ring-transparent hover:ring-[var(--accent-soft)] transition"
              >
                <img
                  src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                  alt={user.displayName}
                  className="w-full h-full object-cover"
                />
              </Link>
              <button
                onClick={() => logout()}
                className="hidden lg:block text-sm text-muted hover:text-app transition px-3"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 bg-surface border border-app text-app text-sm font-medium px-4 py-2.5 rounded-full hover:bg-elevated transition shadow-app"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
