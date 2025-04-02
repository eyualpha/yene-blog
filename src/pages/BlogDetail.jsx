import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db, auth } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const BlogDetail = () => {
  const [blog, setBlog] = useState([]);
  const [targetBlog, setTargetBlog] = useState(null);

  const BlogCollectionRef = collection(db, "blogs");
  useEffect(() => {
    const unsubscribe = onSnapshot(BlogCollectionRef, (snapshot) => {
      const blogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlog(blogs);
    });
    return () => unsubscribe();
  }, []);

  blog.filter((blog) => {
    if (blog.id === targetBlog) {
      setTargetBlog(blog);
    }
  });

  return <div>BlogDetail</div>;
};

export default BlogDetail;
