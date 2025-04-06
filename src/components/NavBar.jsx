import React from "react";
import logo from "../assets/logo.png";
import { auth } from "../config/firebase";
import { useState } from "react";

const NavBar = () => {
  const [isLogedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="w-full bg-[#191919]">
      <div className="max-w-[1240px] mx-auto flex justify-between py-4 text-white">
        <div className="flex items-center gap-2">
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
          {isLogedIn ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              onClick={() => {
                auth.signOut();
                setIsLoggedIn(false);
              }}
            >
              Log Out
            </button>
          ) : (
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-100 transition duration-300"
              onClick={() => setIsLoggedIn(true)}
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
