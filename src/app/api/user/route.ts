import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, markerProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { MARKERS } from "@/data/markers";

// POST /api/user — create a new user
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [newUser] = await db
      .insert(users)
      .values({ name: name.trim() })
      .returning();

    // Pre-create progress rows for all 10 markers
    await db.insert(markerProgress).values(
      MARKERS.map((m) => ({ userId: newUser.id, markerId: m.id }))
    );

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
