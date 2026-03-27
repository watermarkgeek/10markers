import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

export function calculateStreak(
  lastActiveDate: string | null,
  currentStreak: number,
  today: string
): number {
  if (!lastActiveDate) return 1;
  if (lastActiveDate === today) return currentStreak; // already active today

  const last = new Date(lastActiveDate);
  const now = new Date(today);
  const diffDays = Math.round(
    (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) return currentStreak + 1; // consecutive day
  return 1; // streak broken — reset
}

export function starsFromScore(correct: number, total: number): number {
  const pct = correct / total;
  if (pct >= 1) return 3;
  if (pct >= 0.6) return 2;
  return 1;
}

export function formatXp(xp: number): string {
  return xp.toLocaleString();
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
