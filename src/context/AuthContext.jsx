import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../config/firebase";

export const logOut = async () => {
  try {
    await signOut(auth);
    navigate("/");
  } catch (err) {
    setError("Failed to log out.");
    console.log(err);
  }
};

export const signInWithPassword = async (email, password) => {
  if (!email || !password) {
    setError("Email and password are required.");
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    navigate("/");
  } catch (err) {
    setError("Failed to sign in with email and password.");
    console.log(err);
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log(auth, password);
    await signInWithPopup(auth, googleProvider);
    navigate("/");
  } catch (err) {
    setError("Failed to sign in with Google.");
    console.log(err);
  }
};

const AuthContext = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  return <div>AuthContext</div>;
};

export default AuthContext;
