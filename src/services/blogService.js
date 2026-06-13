import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const blogsRef = collection(db, "blogs");

export const subscribeToBlogs = (callback, onError) => {
  const q = query(blogsRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const blogs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(blogs);
    },
    onError
  );
};

export const subscribeToUserBlogs = (userId, callback, onError) => {
  const q = query(blogsRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const blogs = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((blog) => blog.userId === userId);
      callback(blogs);
    },
    onError
  );
};

export const getBlogById = async (blogId) => {
  const blogDoc = await getDoc(doc(db, "blogs", blogId));
  if (!blogDoc.exists()) return null;
  return { id: blogDoc.id, ...blogDoc.data() };
};

export const createBlog = async (blogData) => {
  return addDoc(blogsRef, {
    ...blogData,
    likes: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateBlog = async (blogId, updates) => {
  await updateDoc(doc(db, "blogs", blogId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteBlog = async (blogId) => {
  await deleteDoc(doc(db, "blogs", blogId));
};

export const toggleBlogLike = async (blogId, userId, isLiked) => {
  const blogRef = doc(db, "blogs", blogId);
  if (isLiked) {
    await updateDoc(blogRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
  } else {
    await updateDoc(blogRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
  }
};
