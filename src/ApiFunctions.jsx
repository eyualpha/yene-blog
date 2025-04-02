import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "./config/firebase";
import { onSnapshot, collection, addDoc } from "firebase/firestore";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [blogList, setBlogLists] = useState([]);
  const [commentList, setCommentLists] = useState([]);

  const BlogCollectionRef = collection(db, "blogs");

  useEffect(() => {
    const unsubscribe = onSnapshot(BlogCollectionRef, (snapshot) => {
      const blogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogLists(blogs);
    });
    return () => unsubscribe();
  }, []);

  const getComments = (blogId) => {
    const blogCommentsRef = collection(db, `blogs/${blogId}/comments`);
    const unsubscribe = onSnapshot(blogCommentsRef, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommentLists(comments);
    });
    return () => unsubscribe();
  };

  const addComment = (blogId, comment) => {
    const commentRef = collection(db, `blogs/${blogId}/comments`);
    addDoc(commentRef, comment)
      .then(() => {
        console.log("Comment added successfully!");
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
      });
  };

  return (
    <ApiContext.Provider
      value={{
        blogList,
        commentList,
        getComments,
        addComment,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use the context
export const useApi = () => {
  return useContext(ApiContext);
};
