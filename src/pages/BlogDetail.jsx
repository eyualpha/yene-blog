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
    return <p>Loading blog details...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-700 mb-4">{blog.detail}</p>
      <p className="text-gray-500 text-sm">
        Posted by {blog.author} on {new Date(blog.createdAt).toLocaleString()}
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {commentList.length > 0 ? (
          commentList.map((comment) => (
            <div key={comment.id} className="border-b py-2">
              <div className="flex items-center mt-2">
                <img
                  src={comment.userPhoto}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <p className="text-gray-700 font-semibold">
                  {comment.userName}
                </p>
              </div>
              <p>{comment.text}</p>

              <p className="text-gray-500 text-sm">
                {new Date(comment.createdAt.toDate()).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
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
  );
};

export default BlogDetail;
