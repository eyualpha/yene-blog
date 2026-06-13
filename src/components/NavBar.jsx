import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiBell, FiPhone } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Blog", path: "/#articles" },
  { label: "Write", path: "/profile", auth: true },
  { label: "About", path: "/#newsletter" },
];

const NavBar = () => {
  const { user, logout } = useAuth();
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
              <button
                className="hidden sm:flex w-10 h-10 rounded-full bg-elevated border border-app items-center justify-center text-secondary hover:text-app transition"
                aria-label="Notifications"
              >
                <FiBell size={18} />
              </button>
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
                className="hidden lg:flex items-center gap-2 bg-surface border border-app text-app text-sm font-medium px-4 py-2 rounded-full hover:bg-elevated transition"
              >
                <FiPhone size={14} />
                Profile
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 bg-surface border border-app text-app text-sm font-medium px-4 py-2.5 rounded-full hover:bg-elevated transition shadow-app"
            >
              <FiPhone size={14} />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
