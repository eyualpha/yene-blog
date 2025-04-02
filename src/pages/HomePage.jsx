import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db, auth } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

const HomePage = () => {
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

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-4">Here are the latest blogs:</p>
      <div className="mt-4">
        {blogList.map((blog) => (
          <Link to={`/blog/${blog.id}`} key={blog.id}>
            <div key={blog.id} className="border p-4 mb-4 rounded">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p>{blog.detail}</p>
              <p>{blog.id}</p>
              <p className="text-gray-500">
                {new Date(blog.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
