import { auth, googleProvider } from "../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
// import {
//   logOut,
//   signInWithGoogle,
//   signInWithPassword,
//   error,
// } from "../context/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError("Failed to sign in with Google.");
      console.log(err);
    }
  };

  const signInWithPassword = async (email, password) => {
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

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      setError("Failed to log out.");
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Authentication</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={() => signInWithPassword(email, password)}
        className="mb-2 p-2 bg-blue-500 text-white rounded"
      >
        Sign In
      </button>
      <button
        onClick={signInWithGoogle}
        className="mb-2 p-2 bg-red-500 text-white rounded"
      >
        Sign In with Google
      </button>
      <button
        onClick={logOut}
        className="mb-2 p-2 bg-gray-500 text-white rounded"
      >
        Log Out
      </button>
    </div>
  );
};

export default Auth;
