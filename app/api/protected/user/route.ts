import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { getCurrentUserId } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
