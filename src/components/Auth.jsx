import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [termChecked, setTermChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError("Failed to sign in with Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (isSignUp && !termChecked) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      const message =
        err.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : err.code === "auth/email-already-in-use"
            ? "Email already in use. Try signing in."
            : isSignUp
              ? "Failed to create account."
              : "Failed to sign in.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#191919] text-white p-4">
      <div className="border border-gray-600 p-8 rounded-lg flex flex-col items-center bg-gray-900 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {isSignUp
            ? "Join YeneBlog to publish and engage"
            : "Sign in to publish blogs and comment"}
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-4 w-full text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 p-3 border border-gray-600 bg-gray-800 rounded w-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
          className="mb-4 p-3 border border-gray-600 bg-gray-800 rounded w-full text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
        />

        {isSignUp && (
          <div className="flex items-start gap-2 mb-4 w-full">
            <input
              type="checkbox"
              id="terms"
              checked={termChecked}
              onChange={() => setTermChecked(!termChecked)}
              className="cursor-pointer mt-1"
            />
            <label htmlFor="terms" className="text-gray-400 text-sm">
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>
        )}

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="mb-4 p-3 bg-white text-black rounded w-full font-medium hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : isSignUp
              ? "Sign Up"
              : "Sign In"}
        </button>

        <div className="relative w-full text-center my-4">
          <span className="text-gray-500 text-sm bg-gray-900 px-2 relative z-10">
            or
          </span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full p-3 border border-gray-600 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>

        <p className="mt-6 text-gray-400 text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-white underline hover:no-underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
