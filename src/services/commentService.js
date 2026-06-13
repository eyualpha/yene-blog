import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const subscribeToComments = (blogId, callback, onError) => {
  const commentsRef = collection(db, `blogs/${blogId}/comments`);
  const q = query(commentsRef, orderBy("createdAt", "asc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const comments = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(comments);
    },
    onError
  );
};

export const addComment = async (blogId, commentData) => {
  const commentsRef = collection(db, `blogs/${blogId}/comments`);
  return addDoc(commentsRef, {
    ...commentData,
    createdAt: serverTimestamp(),
  });
};
