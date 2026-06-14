import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { FcGoogle } from "react-icons/fc";
import ThemeToggle from "./ThemeToggle";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [termChecked, setTermChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) navigate("/");
      })
      .catch((err) => {
        console.error("Google redirect sign-in error:", err);
        setError("Failed to sign in with Google.");
      });
  }, [navigate]);

  const signInWithGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      if (import.meta.env.PROD) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
        navigate("/");
      }
    } catch (err) {
      setError("Failed to sign in with Google.");
      console.error(err);
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
    <div className="min-h-screen bg-app flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg">
          Y
        </div>
        <span className="font-bold text-2xl text-app">
          Yene<span className="text-accent">Blog</span>
        </span>
      </Link>

      <div className="bg-card border border-app rounded-3xl shadow-app-lg p-8 md:p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-app mb-1 text-center">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-muted text-sm mb-8 text-center">
          {isSignUp
            ? "Join YeneBlog to publish and engage"
            : "Sign in to publish articles and comment"}
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-500/10 py-2 px-3 rounded-xl">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 bg-input border border-app rounded-2xl text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
            className="w-full px-4 py-3.5 bg-input border border-app rounded-2xl text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />

          {isSignUp && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termChecked}
                onChange={() => setTermChecked(!termChecked)}
                className="mt-1 accent-[var(--accent)]"
              />
              <span className="text-muted text-sm">
                I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>
          )}

          <button
            onClick={handleEmailAuth}
            disabled={loading}
            className="w-full py-3.5 bg-accent hover-accent text-white font-semibold rounded-2xl transition disabled:opacity-50 mt-2 hover:scale-[1.01]"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </div>

        <div className="relative my-6 text-center">
          <span className="text-muted text-xs bg-card px-3 relative z-10">or continue with</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-app" />
          </div>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3.5 border border-app rounded-2xl text-app hover:bg-elevated transition disabled:opacity-50 font-medium"
        >
          <FcGoogle size={22} />
          Google
        </button>

        <p className="mt-8 text-muted text-sm text-center">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-accent font-semibold hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
