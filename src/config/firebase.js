import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const trim = (value) => (typeof value === "string" ? value.trim() : value);

const firebaseConfig = {
  apiKey: trim(import.meta.env.VITE_API_KEY),
  authDomain: trim(import.meta.env.VITE_AUTH_DOMAIN),
  projectId: trim(import.meta.env.VITE_PROJECT_ID),
  storageBucket: trim(import.meta.env.VITE_STORAGE_BUCKET),
  messagingSenderId: trim(import.meta.env.VITE_MESSAGING_SENDER_ID),
  appId: trim(import.meta.env.VITE_APP_ID),
  measurementId: trim(import.meta.env.VITE_MEASUREMENT_ID),
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics is optional — skip if unsupported or misconfigured (common on Vercel)
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  isSupported()
    .then((supported) => {
      if (supported) getAnalytics(app);
    })
    .catch(() => {});
}

export default app;
