"use client";

import { useState, useEffect, useCallback } from "react";
import type { User, MarkerProgress, Badge } from "@/lib/db/schema";

const USER_ID_KEY = "10markers_user_id";

export interface UserState {
  user: User | null;
  progress: MarkerProgress[];
  badges: Badge[];
  loading: boolean;
  error: string | null;
  createUser: (name: string) => Promise<void>;
  completeStage: (
    markerId: number,
    stage: string,
    stars?: number
  ) => Promise<{ xpGain: number; newBadges: unknown[] }>;
  refresh: () => Promise<void>;
}

export function useUser(): UserState {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<MarkerProgress[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (userId: string) => {
    const [userRes, progressRes, badgesRes] = await Promise.all([
      fetch(`/api/user/${userId}`),
      fetch(`/api/progress/${userId}`),
      fetch(`/api/badges/${userId}`),
    ]);

    if (!userRes.ok) throw new Error("Failed to load user");
    const [userData, progressData, badgesData] = await Promise.all([
      userRes.json(),
      progressRes.json(),
      badgesRes.json(),
    ]);

    setUser(userData);
    setProgress(progressData);
    setBadges(badgesData);
  }, []);

  const refresh = useCallback(async () => {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) return;
    try {
      await fetchAll(userId);
    } catch (err) {
      setError(String(err));
    }
  }, [fetchAll]);

  useEffect(() => {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchAll(userId)
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [fetchAll]);

  const createUser = useCallback(
    async (name: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error("Failed to create user");
        const newUser: User = await res.json();
        localStorage.setItem(USER_ID_KEY, newUser.id);
        await fetchAll(newUser.id);
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAll]
  );

  const completeStage = useCallback(
    async (markerId: number, stage: string, stars?: number) => {
      const userId = localStorage.getItem(USER_ID_KEY);
      if (!userId) throw new Error("No user");

      const res = await fetch(`/api/progress/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markerId, stage, stars }),
      });

      if (!res.ok) throw new Error("Failed to update progress");
      const result = await res.json();

      // Update local state immediately for snappy UX
      setProgress((prev) =>
        prev.map((p) =>
          p.markerId === markerId ? result.progress : p
        )
      );
      setUser((prev) =>
        prev
          ? { ...prev, totalXp: prev.totalXp + (result.xpGain ?? 0) }
          : prev
      );

      if (result.newBadges?.length > 0) {
        await refresh(); // re-fetch badges
      }

      return { xpGain: result.xpGain, newBadges: result.newBadges };
    },
    [refresh]
  );

  return { user, progress, badges, loading, error, createUser, completeStage, refresh };
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}
