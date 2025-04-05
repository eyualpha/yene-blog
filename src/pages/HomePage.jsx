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
import BlogCard from "../components/BlogCard";

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
      <BlogCard blogList={blogList} handleLike={handleLike} />
    </div>
  );
};

export default HomePage;
