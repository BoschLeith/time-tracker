import { db } from "@/drizzle/db";
import { transactions } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allTransactions = await db.select().from(transactions);
    return NextResponse.json(allTransactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, clientId, amount, description } = await req.json();

    const [newTransaction] = await db
      .insert(transactions)
      .values({ userId, clientId, amount, description })
      .returning();

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
