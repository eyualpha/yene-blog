import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blogList, handleLike }) => {
  return (
    <div className=" flex p-4 border border-gray-300 rounded-lg bg-white shadow-md gap-4 w-full max-w-7xl flex-wrap justify-center self-center">
      {blogList.map((blog) => (
        <div
          key={blog.id}
          className="border p-4 mb-4 rounded flex flex-col  w-1/3 flex-shrink-0 "
        >
          <Link to={`/blog/${blog.id}`} key={blog.id}>
            <div className="flex items-center mt-2">
              <img
                src={blog.authorPhoto}
                alt={blog.author}
                className="w-8 h-8 rounded-full mr-2"
              />
              <p className="text-gray-700 font-semibold">{blog.author}</p>
            </div>
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p>{blog.detail}</p>
            <p className="text-gray-500">
              {new Date(blog.createdAt).toLocaleString()}
            </p>
          </Link>
          <button
            onClick={() => handleLike(blog.id)}
            className="cursor-pointer flex items-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png"
              alt="like"
              className="w-6 h-6"
            />
            <span className="text-gray-700 font-semibold ml-2">
              {blog.likes}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default BlogCard;
