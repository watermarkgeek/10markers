export type Stage = "intro" | "repeat" | "match" | "fillblank" | "quiz";

export const STAGES: Stage[] = ["intro", "repeat", "match", "fillblank", "quiz"];

export const STAGE_LABELS: Record<Stage, string> = {
  intro: "Learn",
  repeat: "Repeat",
  match: "Match",
  fillblank: "Fill In",
  quiz: "Prove It",
};

export const XP_VALUES: Record<Stage, number> = {
  intro: 10,
  repeat: 20,
  match: 30,
  fillblank: 30,
  quiz: 50,
};

export interface MarkerProgress {
  markerId: number;
  stagesCompleted: Stage[];
  stars: number; // 0–3, earned in quiz
  xpEarned: number;
  lastActivityAt: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  totalXp: number;
  streakDays: number;
  lastActiveDate: string | null;
}

export interface Badge {
  id: string;
  userId: string;
  type: BadgeType;
  markerId?: number;
  pillar?: string;
  earnedAt: string;
}

export type BadgeType =
  | "marker_complete"
  | "pillar_abiding"
  | "pillar_making"
  | "pillar_together"
  | "all_complete"
  | "streak_7"
  | "streak_30";

export interface GameResult {
  score: number;
  total: number;
  stars: number;
  xpEarned: number;
}
