import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="w-full bg-[#191919f0] fixed top-0 left-0 z-50">
      <div className="max-w-[1440px] mx-auto flex justify-between py-4 text-white items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="w-10" />
          <h1 className="font-bold text-3xl">YeneBlog</h1>
        </div>
        <nav>
          <ul className="flex gap-4">
            <li>
              <a href="/" className="hover:text-gray-400">
                Home
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-gray-400">
                Profile
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <img
                src={auth.currentUser.photoURL}
                alt={auth.currentUser.displayName}
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={() => navigate("/profile")}
              />
              <span
                className="mr-2  cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                {auth.currentUser.displayName}
              </span>
            </div>
          ) : (
            <button
              className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-100 transition duration-300"
              onClick={handleLogin}
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
