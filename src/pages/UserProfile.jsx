import React from "react";
import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { signOut } from "firebase/auth";

const UserProfile = () => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();
  const [blogList, setBlogList] = useState([]);
  const [userBlogList, setUserBlogList] = useState([]);
  const [error, setError] = useState(null);

  const BlogCollectionRef = collection(db, "blogs");

  useEffect(() => {
    const unsubscribe = onSnapshot(BlogCollectionRef, (snapshot) => {
      const blogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogList(blogs);

      const userBlogs = blogs.filter(
        (blog) => blog.userId === auth.currentUser.uid
      );
      setUserBlogList(userBlogs);
    });

    return () => unsubscribe();
  }, []);

  const addBlog = async () => {
    if (!title || !detail) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      await addDoc(BlogCollectionRef, {
        title: title,
        detail: detail,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        likes: 0,
        author: auth.currentUser.displayName,
        authorId: auth.currentUser.uid,
        authorPhoto: auth.currentUser.photoURL,
        authorEmail: auth.currentUser.email,
      });
      console.log("Blog added successfully!");
    } catch (error) {
      console.error("Error adding blog: ", error);
    }
    setTitle("");
    setDetail("");
  };

  const handleLogOut = async () => {
    try {
      navigate("/");
      await signOut(auth);
      console.log("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full bg-[#191919] text-white p-4 min-h-screen py-22">
      <div className=" max-w-[1440px] mx-auto flex flex-col items-center justify-center px-4">
        <div className=" flex items-center justify-between w-full mb-4">
          <p className="text-lg font-semibold my-2">
            Welcome, <strong>{auth.currentUser.displayName}</strong>
          </p>
          <button
            className="bg-gray-300 text-black hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        </div>

        <h2 className="text-2xl font-bold my-4">Add New Blog</h2>

        <div className="flex flex-col w-lg mb-4">
          <div className=" text-red-500 text-center p-2">{error}</div>
          <input
            type="text"
            value={title}
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
            className=" border border-gray-300 rounded my-2 p-2"
          />
          <input
            type="text"
            value={detail}
            placeholder="detail"
            onChange={(e) => setDetail(e.target.value)}
            className=" border border-gray-300 rounded my-2 p-2"
          />
          <button
            onClick={addBlog}
            className="bg-gray-300 text-black p-2 rounded"
          >
            Add
          </button>
        </div>
        <h2 className="text-2xl font-bold my-4">Your Blogs</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {userBlogList.length > 0 ? (
            <BlogCard blogList={userBlogList} />
          ) : (
            <p>No blogs found for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
