import { useEffect, useState } from "react";
import { subscribeToAuthorStats } from "../services/authorStatsService";

export const useAuthorStats = (userId) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(Boolean(userId));

  useEffect(() => {
    if (!userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToAuthorStats(
      userId,
      (data) => {
        setStats(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [userId]);

  return { stats, loading };
};
