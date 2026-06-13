export const AUTHOR_LEVELS = [
  { id: "seedling", minPoints: 0, label: "Seedling", icon: "🌱", color: "#22c55e" },
  { id: "scribe", minPoints: 50, label: "Scribe", icon: "✍️", color: "#3b82f6" },
  { id: "storyteller", minPoints: 150, label: "Storyteller", icon: "📖", color: "#8b5cf6" },
  { id: "wordsmith", minPoints: 400, label: "Wordsmith", icon: "🔥", color: "#f97316" },
  { id: "legend", minPoints: 800, label: "Legend", icon: "👑", color: "#eab308" },
];

export const BADGE_DEFINITIONS = [
  { id: "on-fire", label: "On Fire", icon: "🔥", check: (s) => (s.currentStreak || 0) >= 3 },
  { id: "week-warrior", label: "Week Warrior", icon: "⚡", check: (s) => (s.currentStreak || 0) >= 7 },
  { id: "monthly-master", label: "Monthly Master", icon: "🏆", check: (s) => (s.currentStreak || 0) >= 30 },
  { id: "regular", label: "Regular", icon: "📝", check: (s) => (s.totalPublished || 0) >= 5 },
  { id: "prolific", label: "Prolific", icon: "📚", check: (s) => (s.totalPublished || 0) >= 25 },
  { id: "centurion", label: "Centurion", icon: "💯", check: (s) => (s.points || 0) >= 100 },
  { id: "elite", label: "Elite", icon: "💎", check: (s) => (s.points || 0) >= 500 },
];

export const getAuthorLevel = (points = 0) => {
  let level = AUTHOR_LEVELS[0];
  for (const tier of AUTHOR_LEVELS) {
    if (points >= tier.minPoints) level = tier;
  }

  const next = AUTHOR_LEVELS.find((t) => t.minPoints > points);
  const progress = next
    ? ((points - level.minPoints) / (next.minPoints - level.minPoints)) * 100
    : 100;

  return { ...level, progress: Math.min(100, Math.max(0, progress)), nextLabel: next?.label };
};

export const getEarnedBadges = (stats) => {
  if (!stats) return [];
  return BADGE_DEFINITIONS.filter((b) => b.check(stats));
};

export const formatRewardMessage = (reward) => {
  if (!reward?.pointsEarned) return "";
  let msg = `+${reward.pointsEarned} points earned!`;
  if (reward.streakBonus) msg += ` (${reward.streakBonus} streak bonus)`;
  if (reward.newStreak > 1) msg += ` · ${reward.newStreak}-day streak 🔥`;
  return msg;
};
