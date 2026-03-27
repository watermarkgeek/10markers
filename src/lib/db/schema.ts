import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActiveDate: text("last_active_date"), // ISO date string YYYY-MM-DD
  streakDays: integer("streak_days").default(0).notNull(),
  totalXp: integer("total_xp").default(0).notNull(),
});

// ─── Marker Progress ──────────────────────────────────────────────────────────
export const markerProgress = pgTable("marker_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  markerId: integer("marker_id").notNull(), // 1–10
  introCompleted: boolean("intro_completed").default(false).notNull(),
  repeatCompleted: boolean("repeat_completed").default(false).notNull(),
  matchCompleted: boolean("match_completed").default(false).notNull(),
  fillblankCompleted: boolean("fillblank_completed").default(false).notNull(),
  quizCompleted: boolean("quiz_completed").default(false).notNull(),
  stars: integer("stars").default(0).notNull(), // 0–3 from quiz
  xpEarned: integer("xp_earned").default(0).notNull(),
  lastActivityAt: timestamp("last_activity_at"),
});

// ─── Badges ──────────────────────────────────────────────────────────────────
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // BadgeType
  markerId: integer("marker_id"), // nullable — only for marker_complete badges
  pillar: text("pillar"), // nullable — only for pillar badges
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type MarkerProgress = typeof markerProgress.$inferSelect;
export type NewMarkerProgress = typeof markerProgress.$inferInsert;
export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
