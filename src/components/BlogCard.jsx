import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { auth } from "../config/firebase";

const BlogCard = ({ blogList, handleLike }) => {
  const [likedBlogs, setLikedBlogs] = useState({});

  useEffect(() => {
    const initialLikedState = {};
    blogList.forEach((blog) => {
      if (blog.likedBy && blog.likedBy.includes(auth.currentUser?.uid)) {
        initialLikedState[blog.id] = true;
      } else {
        initialLikedState[blog.id] = false;
      }
    });
    setLikedBlogs(initialLikedState);
  }, [blogList]);

  const handleLikeClick = (blogId) => {
    setLikedBlogs((prevState) => ({
      ...prevState,
      [blogId]: !prevState[blogId],
    }));

    handleLike(blogId);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  if (!blogList || blogList.length === 0) {
    return <p className="text-gray-400">No blogs available.</p>;
  }

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-4 px-4 py-8">
      {blogList.map((blog) => (
        <div
          key={blog.id}
          className="border border-gray-500 mb-4 p-4 rounded-lg flex flex-col w-[300px] flex-shrink-0 h-[300px] bg-gray-900 hover:scale-105 transition duration-300 ease-in-out"
        >
          <Link to={`/blog/${blog.id}`} key={blog.id}>
            <div className="h-[250px] w-full">
              <div className="flex items-center mb-2">
                <img
                  src={blog.authorPhoto}
                  alt={blog.author}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex flex-col">
                  <p className="text-gray-300 font-semibold">{blog.author}</p>
                  <p className="text-gray-400 text-sm">{blog.authorEmail}</p>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-400">{truncateText(blog.detail, 100)}</p>
            </div>
          </Link>
          <div className="flex justify-between items-center mt-auto z-10">
            <p className="text-gray-400">
              {new Date(blog.createdAt).toLocaleString()}
            </p>

            <button
              onClick={() => handleLikeClick(blog.id)}
              className="cursor-pointer flex items-center text-white"
            >
              {likedBlogs[blog.id] && auth.currentUser ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-400" />
              )}
              <span className="text-gray-400 font-semibold ml-2">
                {blog.likes}
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogCard;
