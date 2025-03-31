// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLFE2mALlYGR2nWEXgadcwa3r3EmUTnuM",
  authDomain: "yene-blog.firebaseapp.com",
  projectId: "yene-blog",
  storageBucket: "yene-blog.firebasestorage.app",
  messagingSenderId: "949462630883",
  appId: "1:949462630883:web:2419c823912b746bc8a0d6",
  measurementId: "G-X8W4N05RRS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
