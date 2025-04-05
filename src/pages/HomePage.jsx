import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const [blogList, setBlogList] = useState([]);

  const BlogCollectionRef = collection(db, "blogs");

  useEffect(() => {
    const unsubscribe = onSnapshot(BlogCollectionRef, (snapshot) => {
      const blogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogList(blogs);
    });
    return () => unsubscribe();
  }, []);

  const handleLike = async (blogId) => {
    if (!auth.currentUser) {
      alert("You must be logged in to like a blog!");
      navigate("/auth");
      return;
    }

    const userId = auth.currentUser.uid;
    const blogRef = doc(db, "blogs", blogId);

    const blog = blogList.find((b) => b.id === blogId);

    if (!blog) {
      console.error("Blog not found!");
      return;
    }

    try {
      if (blog.likedBy && blog.likedBy.includes(userId)) {
        await updateDoc(blogRef, {
          likes: blog.likes - 1,
          likedBy: arrayRemove(userId),
        });
        console.log("Blog unliked successfully!");
      } else {
        await updateDoc(blogRef, {
          likes: blog.likes + 1,
          likedBy: arrayUnion(userId),
        });
        console.log("Blog liked successfully!");
      }
    } catch (error) {
      console.error("Error updating the like status: ", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
      <button onClick={() => navigate("/profile")}>Add Blog</button>
      {auth.currentUser ? (
        <div className="flex items-center mt-4">
          <img
            src={auth.currentUser.photoURL}
            alt={auth.currentUser.displayName}
            className="w-8 h-8 rounded-full mr-2"
          />
          <p className="mt-4">Welcome, {auth.currentUser.displayName}</p>
          <button className=" bg-red-500 text-white" onClick={logOut}>
            Log Out
          </button>
        </div>
      ) : (
        <button
          className=" bg-red-500 text-white"
          onClick={() => navigate("/auth")}
        >
          Log In
        </button>
      )}

      <p className="mt-4">Here are the latest blogs:</p>
      <div className="mt-4">
        {blogList.map((blog) => (
          <div key={blog.id} className="border p-4 mb-4 rounded w-md">
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
            <p className="text-gray-500 text-sm">Likes: {blog.likes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
