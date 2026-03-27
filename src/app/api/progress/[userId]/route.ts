import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { markerProgress, users, badges } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { XP_VALUES } from "@/types";
import type { Stage } from "@/types";
import { MARKERS, getMarkersByPillar } from "@/data/markers";
import type { Pillar } from "@/data/markers";

// GET /api/progress/[userId] — all marker progress for a user
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const rows = await db
      .select()
      .from(markerProgress)
      .where(eq(markerProgress.userId, userId));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/progress/[userId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/progress/[userId] — mark a stage complete for a marker
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { markerId, stage, stars } = await req.json() as {
      markerId: number;
      stage: Stage;
      stars?: number;
    };

    if (!markerId || !stage) {
      return NextResponse.json({ error: "markerId and stage required" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(markerProgress)
      .where(
        and(
          eq(markerProgress.userId, userId),
          eq(markerProgress.markerId, markerId)
        )
      );

    if (!existing) {
      return NextResponse.json({ error: "Progress row not found" }, { status: 404 });
    }

    // Only award XP if stage not already completed
    const stageCol = `${stage}Completed` as keyof typeof existing;
    const alreadyDone = existing[stageCol] as boolean;
    const xpGain = alreadyDone ? 0 : XP_VALUES[stage];

    const updates: Record<string, unknown> = {
      [`${stage}Completed`]: true,
      lastActivityAt: new Date(),
      xpEarned: existing.xpEarned + xpGain,
    };

    if (stage === "quiz" && typeof stars === "number") {
      // Only update stars if improvement
      updates.stars = Math.max(existing.stars, stars);
    }

    const [updated] = await db
      .update(markerProgress)
      .set(updates)
      .where(
        and(
          eq(markerProgress.userId, userId),
          eq(markerProgress.markerId, markerId)
        )
      )
      .returning();

    // Award total XP to user
    if (xpGain > 0) {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (user) {
        await db
          .update(users)
          .set({ totalXp: user.totalXp + xpGain })
          .where(eq(users.id, userId));
      }
    }

    // Check for badges if quiz just completed
    const newBadges: { type: string; markerId?: number; pillar?: string }[] = [];

    if (stage === "quiz" && !alreadyDone) {
      // Check if marker is now fully complete (all stages done)
      const isMarkerComplete =
        updated.introCompleted &&
        updated.repeatCompleted &&
        updated.matchCompleted &&
        updated.fillblankCompleted &&
        updated.quizCompleted;

      if (isMarkerComplete) {
        // Check if badge already exists
        const existingBadge = await db
          .select()
          .from(badges)
          .where(
            and(
              eq(badges.userId, userId),
              eq(badges.type, "marker_complete"),
              eq(badges.markerId, markerId)
            )
          );

        if (existingBadge.length === 0) {
          await db.insert(badges).values({
            userId,
            type: "marker_complete",
            markerId,
          });
          newBadges.push({ type: "marker_complete", markerId });
        }

        // Check if pillar is complete
        const marker = MARKERS.find((m) => m.id === markerId);
        if (marker) {
          const pillar = marker.pillar as Pillar;
          const pillarMarkers = getMarkersByPillar(pillar);
          const allProgress = await db
            .select()
            .from(markerProgress)
            .where(eq(markerProgress.userId, userId));

          const pillarDone = pillarMarkers.every((pm) => {
            const p = allProgress.find((ap) => ap.markerId === pm.id);
            return p?.quizCompleted;
          });

          if (pillarDone) {
            const pillarBadgeType = `pillar_${pillar}`;
            const existingPillarBadge = await db
              .select()
              .from(badges)
              .where(
                and(
                  eq(badges.userId, userId),
                  eq(badges.type, pillarBadgeType)
                )
              );

            if (existingPillarBadge.length === 0) {
              await db.insert(badges).values({
                userId,
                type: pillarBadgeType,
                pillar,
              });
              newBadges.push({ type: pillarBadgeType, pillar });
            }

            // Check if ALL markers complete
            const allDone = MARKERS.every((m) => {
              const p = allProgress.find((ap) => ap.markerId === m.id);
              return m.id === markerId ? true : p?.quizCompleted;
            });

            if (allDone) {
              const existingAllBadge = await db
                .select()
                .from(badges)
                .where(
                  and(eq(badges.userId, userId), eq(badges.type, "all_complete"))
                );

              if (existingAllBadge.length === 0) {
                await db.insert(badges).values({ userId, type: "all_complete" });
                newBadges.push({ type: "all_complete" });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ progress: updated, xpGain, newBadges });
  } catch (error) {
    console.error("POST /api/progress/[userId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
