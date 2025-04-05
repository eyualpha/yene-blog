import React from "react";
import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const UserProfile = () => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();
  const [blogList, setBlogList] = useState([]);
  const [userBlogList, setUserBlogList] = useState([]);

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
      alert("Please fill in all fields.");
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
      });
      console.log("Blog added successfully!");
    } catch (error) {
      console.error("Error adding blog: ", error);
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Welcome to your profile!</p>
      <p>Your email: {auth.currentUser.email}</p>
      <p>Your name: {auth.currentUser.displayName}</p>
      <p>Your UID: {auth.currentUser.uid}</p>
      <img src={auth.currentUser.photoURL} alt="" />

      <h2 className="text-2xl font-bold">Your Blogs</h2>
      <div className="mt-4 flex flex-wrap gap-4">
        {userBlogList.length > 0 ? (
          userBlogList.map((blog) => (
            <Link to={`/blog/${blog.id}`} key={blog.id}>
              <div key={blog.id} className="border p-4 mb-4 rounded w-md">
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
                <p>{blog.id}</p>
                <p className="text-gray-500">
                  {new Date(blog.createdAt).toLocaleString()}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No blogs found for this user.</p>
        )}
      </div>
      <h2 className="text-2xl font-bold">Add New Blog</h2>

      <div className="flex flex-col w-lg  bg-gray-100">
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
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
