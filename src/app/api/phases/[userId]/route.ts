import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type PhaseKey = "vision" | "markers" | "pillars";

const PHASE_XP: Record<PhaseKey, number> = {
  vision: 50,
  markers: 75,
  pillars: 100,
};

// GET /api/phases/[userId] — phase progress for a user
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      visionCompleted: user.visionCompleted,
      markersCompleted: user.markersCompleted,
      pillarsCompleted: user.pillarsCompleted,
      visionStars: user.visionStars,
      markersStars: user.markersStars,
      pillarsStars: user.pillarsStars,
    });
  } catch (error) {
    console.error("GET /api/phases/[userId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/phases/[userId] — mark a phase complete
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { phase, stars } = await req.json() as { phase: PhaseKey; stars: number };

    if (!phase || typeof stars !== "number") {
      return NextResponse.json({ error: "phase and stars required" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedKey = `${phase}Completed` as keyof typeof user;
    const starsKey = `${phase}Stars` as keyof typeof user;
    const alreadyDone = user[completedKey] as boolean;
    const xpGain = alreadyDone ? 0 : PHASE_XP[phase];
    const currentStars = user[starsKey] as number;

    const updates: Record<string, unknown> = {
      [`${phase}Completed`]: true,
      [`${phase}Stars`]: Math.max(currentStars, stars),
    };

    if (xpGain > 0) {
      updates.totalXp = user.totalXp + xpGain;
    }

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      user: updated,
      xpGain,
    });
  } catch (error) {
    console.error("POST /api/phases/[userId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
