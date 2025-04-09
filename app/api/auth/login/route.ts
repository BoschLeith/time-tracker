import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { encrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
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

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }

  const token = await encrypt({ id: user.id, email: user.email });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email },
  });
}
