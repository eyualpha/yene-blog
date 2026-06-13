import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const subscribeToBookmarks = (userId, callback, onError) => {
  const bookmarksRef = collection(db, `users/${userId}/bookmarks`);
  return onSnapshot(
    bookmarksRef,
    (snapshot) => {
      const bookmarks = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(bookmarks);
    },
    onError
  );
};

export const addBookmark = async (userId, blog) => {
  const bookmarkRef = doc(db, `users/${userId}/bookmarks`, blog.id);
  await setDoc(bookmarkRef, {
    blogId: blog.id,
    title: blog.title,
    coverImage: blog.coverImage || "",
    author: blog.author,
    authorId: blog.authorId || blog.userId,
    category: blog.category || "",
    savedAt: serverTimestamp(),
  });
};

export const removeBookmark = async (userId, blogId) => {
  await deleteDoc(doc(db, `users/${userId}/bookmarks`, blogId));
};

export const isBlogBookmarked = (bookmarks, blogId) =>
  bookmarks.some((b) => b.blogId === blogId || b.id === blogId);
