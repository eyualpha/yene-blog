import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const logOut = async () => {
  const navigate = useNavigate();
  try {
    await signOut(auth);
    navigate("/");
  } catch (err) {
    console.log(err);
  }
};
