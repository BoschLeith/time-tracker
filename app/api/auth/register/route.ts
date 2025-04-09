import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  await db.insert(users).values({
    email,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ success: true });
}
