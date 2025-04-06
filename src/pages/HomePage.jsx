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
    <div className=" w-full  bg-[#191919] text-white pt-15">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center text-center mt-10 h-[70vh] gap-8">
          <p className="text-gray-400 text-2xl mb-2 font-bold">
            Begin your journey toward deeper knowledge and meaningful insights
            here.
          </p>
          <h1 className="text-7xl font-bold mb-4">
            Discover Fresh Insights, Stories, and Ideas — Dive into Our Latest
            Blogs.
          </h1>
          <p className="text-gray-400 text-3xl mb-2 w-4xl ">
            Explore articles crafted by passionate writers and creators. From
            deep tech dives to everyday insights — there’s something for every
            curious mind.
          </p>
          <button
            onClick={() => navigate("/profile")}
            className=" text-black bg-white hover:bg-gray-300 px-4 py-2 rounded-lg transition duration-300 text-2xl "
          >
            Publish Your Blog
          </button>
        </div>
        <p className=" text-5xl self-start">Explore Our Latest Blogs</p>
        <BlogCard blogList={blogList} handleLike={handleLike} />
      </div>
    </div>
  );
};

export default HomePage;
