import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { badges } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET /api/badges/[userId] — fetch all badges for a user
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const rows = await db
      .select()
      .from(badges)
      .where(eq(badges.userId, userId));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/badges/[userId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
