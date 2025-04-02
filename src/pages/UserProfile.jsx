import React from "react";
import { useState } from "react";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const UserProfile = () => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  const blogCollectionRef = collection(db, "blogs");

  const addBlog = async () => {
    try {
      await addDoc(blogCollectionRef, {
        title: title,
        detail: detail,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        like: 0,
        author: auth.currentUser.displayName,
        authorId: auth.currentUser.uid,
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

      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
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
