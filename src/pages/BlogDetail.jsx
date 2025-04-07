import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

const BlogDetail = () => {
  const navigate = useNavigate();
  const { id: blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const blogDocRef = doc(db, "blogs", blogId);
        const blogDoc = await getDoc(blogDocRef);

        if (blogDoc.exists()) {
          setBlog({ id: blogDoc.id, ...blogDoc.data() });
        } else {
          console.error("Blog not found!");
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  useEffect(() => {
    const fetchComments = () => {
      const commentsRef = collection(db, `blogs/${blogId}/comments`);
      const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
        const comments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommentList(comments);
      });

      return () => unsubscribe();
    };

    fetchComments();
  }, [blogId]);

  const handleAddComment = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to comment!");
      navigate("/auth");
      return;
    }
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    const commentData = {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName,
      userPhoto: auth.currentUser.photoURL,
      text: newComment,
      createdAt: new Date(),
    };

    try {
      const commentsRef = collection(db, `blogs/${blogId}/comments`);
      await addDoc(commentsRef, commentData);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!blog) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#191919] text-white">
        <p>Loading blog details...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#191919]  px-4 min-h-screen py-22">
      <div className="max-w-[800px] mx-auto flex flex-col items-start justify-start p-4 bg-gray-900 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-200 mb-4">{blog.detail}</p>
        <p className="text-gray-400 text-sm">
          Posted by {blog.author} on {new Date(blog.createdAt).toLocaleString()}
        </p>

        <div className="mt-8 w-full bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          {commentList.length > 0 ? (
            commentList.map((comment) => (
              <div key={comment.id} className="mb-2 p-2  rounded-lg w-full">
                <div className="flex items-center my-2 ">
                  <img
                    src={comment.userPhoto}
                    alt={comment.userName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <p className="text-gray-300 font-semibold">
                    {comment.userName}
                  </p>
                </div>
                <p>{comment.text}</p>

                <p className="text-gray-400 text-sm">
                  {new Date(comment.createdAt.toDate()).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
