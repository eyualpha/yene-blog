import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLFE2mALlYGR2nWEXgadcwa3r3EmUTnuM",
  authDomain: "yene-blog.firebaseapp.com",
  projectId: "yene-blog",
  storageBucket: "yene-blog.firebasestorage.app",
  messagingSenderId: "949462630883",
  appId: "1:949462630883:web:2419c823912b746bc8a0d6",
  measurementId: "G-X8W4N05RRS",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
