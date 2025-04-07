import { auth, googleProvider } from "../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { MdCheckBox } from "react-icons/md";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [termChecked, setTermChecked] = useState(false);

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
    if (!termChecked) {
      setError("You must agree to the terms and conditions.");
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#191919] text-white p-4">
      <div className="border border-gray-500 p-8 rounded-lg flex flex-col items-center justify-center bg-gray-900 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8">Get Started</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <div className="flex items-start gap-2 mb-4">
          <input
            type="checkbox"
            checked={termChecked}
            onChange={() => setTermChecked(!termChecked)}
            className="cursor-pointer mt-1"
          />
          <label className="text-gray-300">
            By creating an account, I confirm that I have read and agree to the
            Terms of Service and Privacy Policy.
          </label>
        </div>

        <button
          onClick={() => signInWithPassword(email, password)}
          className="my-8 p-2 bg-gray-500 text-white rounded w-full"
        >
          Sign up
        </button>
        <button onClick={signInWithGoogle} className="mb-2 p-2">
          <FcGoogle size={30} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
