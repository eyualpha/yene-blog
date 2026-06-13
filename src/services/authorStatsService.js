import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../config/firebase";

const statsRef = (userId) => doc(db, "authorStats", userId);

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const getTodayKey = () => toDateKey(new Date());

export const getYesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateKey(d);
};

const calcPoints = (currentStreak, isFirstToday) => {
  if (isFirstToday) {
    const streakBonus = Math.max(0, currentStreak - 1) * 2;
    return { pointsEarned: 10 + streakBonus, streakBonus };
  }
  return { pointsEarned: 5, streakBonus: 0 };
};

export const subscribeToAuthorStats = (userId, callback, onError) => {
  return onSnapshot(
    statsRef(userId),
    (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    onError
  );
};

export const getAuthorStats = async (userId) => {
  const snap = await getDoc(statsRef(userId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

/**
 * Awards points & updates streak when an article is published.
 * Only call for newly published posts (not drafts, not re-edits).
 */
export const recordPublishActivity = async (userId, { displayName, photoURL }) => {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  const ref = statsRef(userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const reward = { pointsEarned: 10, streakBonus: 0, newStreak: 1 };
    await setDoc(ref, {
      userId,
      displayName: displayName || "Anonymous",
      photoURL: photoURL || "",
      points: 10,
      currentStreak: 1,
      longestStreak: 1,
      lastPublishDate: today,
      totalPublished: 1,
      updatedAt: serverTimestamp(),
    });
    return reward;
  }

  const data = snap.data();
  const isFirstToday = data.lastPublishDate === today;
  let currentStreak = data.currentStreak || 0;

  if (!isFirstToday) {
    if (data.lastPublishDate === yesterday) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
  }

  const { pointsEarned, streakBonus } = calcPoints(currentStreak, !isFirstToday);
  const longestStreak = Math.max(data.longestStreak || 0, currentStreak);

  await updateDoc(ref, {
    displayName: displayName || data.displayName,
    photoURL: photoURL || data.photoURL,
    points: (data.points || 0) + pointsEarned,
    currentStreak,
    longestStreak,
    lastPublishDate: today,
    totalPublished: increment(1),
    updatedAt: serverTimestamp(),
  });

  return { pointsEarned, streakBonus, newStreak: currentStreak };
};
