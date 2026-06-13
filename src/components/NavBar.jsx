import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-[#191919f0] backdrop-blur-sm fixed top-0 left-0 z-50 border-b border-gray-800">
      <div className="max-w-[1440px] mx-auto flex justify-between py-4 px-4 text-white items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="YeneBlog logo" className="w-10" />
          <h1 className="font-bold text-2xl md:text-3xl">YeneBlog</h1>
        </Link>

        <nav>
          <ul className="flex gap-4 md:gap-6">
            <li>
              <Link to="/" className="hover:text-gray-400 transition">
                Home
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/profile" className="hover:text-gray-400 transition">
                  Profile
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                <img
                  src={user.photoURL || "https://via.placeholder.com/32"}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden sm:inline text-sm">
                  {user.displayName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition hidden md:block"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-100 transition text-sm font-medium"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
