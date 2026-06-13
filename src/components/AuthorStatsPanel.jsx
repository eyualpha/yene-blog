import { FiZap, FiAward, FiTrendingUp } from "react-icons/fi";
import { getAuthorLevel, getEarnedBadges } from "../utils/authorGamification";

const StatBox = ({ label, value, sub, accent }) => (
  <div className="flex flex-col items-center p-4 rounded-2xl bg-elevated border border-app min-w-[100px]">
    <span className={`text-2xl font-bold ${accent || "text-app"}`}>{value}</span>
    <span className="text-xs text-muted mt-1">{label}</span>
    {sub && <span className="text-[10px] text-muted mt-0.5">{sub}</span>}
  </div>
);

const AuthorStatsPanel = ({ stats, loading, compact = false }) => {
  if (loading) {
    return (
      <div className="animate-pulse bg-elevated rounded-2xl h-24 border border-app" />
    );
  }

  if (!stats) {
    return (
      <div className="p-5 rounded-2xl bg-accent-soft border border-app text-center">
        <p className="text-sm text-secondary">
          Publish your first article to start earning points and build a streak!
        </p>
      </div>
    );
  }

  const level = getAuthorLevel(stats.points || 0);
  const badges = getEarnedBadges(stats);

  if (compact) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-app bg-elevated"
          title={level.label}
        >
          {level.icon} {level.label}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted">
          <FiZap className="text-orange-500" />
          {stats.currentStreak || 0}d streak
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted">
          <FiAward className="text-accent" />
          {stats.points || 0} pts
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-card border border-app shadow-app">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border border-app"
            style={{ backgroundColor: `${level.color}20` }}
          >
            {level.icon}
          </div>
          <div>
            <p className="text-lg font-bold text-app">{level.label}</p>
            <p className="text-sm text-muted">
              {stats.points || 0} points
              {level.nextLabel && ` · ${Math.round(level.progress)}% to ${level.nextLabel}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 text-orange-500 text-sm font-semibold">
          <FiTrendingUp size={14} />
          {stats.currentStreak || 0} day streak
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-elevated mb-5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${level.progress}%`, backgroundColor: level.color }}
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <StatBox label="Points" value={stats.points || 0} accent="text-accent" />
        <StatBox
          label="Streak"
          value={stats.currentStreak || 0}
          sub={`Best: ${stats.longestStreak || 0}`}
          accent="text-orange-500"
        />
        <StatBox label="Published" value={stats.totalPublished || 0} />
      </div>

      {badges.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Badges earned
          </p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge.id}
                title={badge.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-elevated border border-app text-app hover:border-accent transition"
              >
                {badge.icon} {badge.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {badges.length === 0 && (
        <p className="text-xs text-muted">
          Keep publishing daily to unlock badges like Week Warrior and Prolific!
        </p>
      )}
    </div>
  );
};

export default AuthorStatsPanel;
