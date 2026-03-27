import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getTodayString, calculateStreak } from "@/lib/utils";

// GET /api/user/[userId] — fetch a user profile
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/user/[userId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/user/[userId] — update XP, streak, or last active date
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await req.json();
    const today = getTodayString();

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newStreak = calculateStreak(existing.lastActiveDate, existing.streakDays, today);

    const updates: Partial<typeof existing> = {
      lastActiveDate: today,
      streakDays: newStreak,
    };

    if (typeof body.totalXp === "number") {
      updates.totalXp = body.totalXp;
    }

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/user/[userId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
