import { getAuthorLevel } from "../utils/authorGamification";
import { useAuthorStats } from "../hooks/useAuthorStats";

const AuthorBadge = ({ authorId, showPoints = false }) => {
  const { stats } = useAuthorStats(authorId);

  if (!stats) return null;

  const level = getAuthorLevel(stats.points || 0);

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-elevated border border-app text-secondary ml-1"
      title={`${level.label} · ${stats.points} pts · ${stats.currentStreak}d streak`}
    >
      {level.icon}
      {showPoints && <span>{stats.points}</span>}
    </span>
  );
};

export default AuthorBadge;
