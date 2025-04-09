import { db } from "@/drizzle/db";
import { transactions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const paramsId = (await params).clientId;
    const id = parseInt(paramsId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid client ID" },
        { status: 400 }
      );
    }

    const transactionsForClient = await db
      .select()
      .from(transactions)
      .where(eq(transactions.clientId, id));

    if (!transactionsForClient) {
      return NextResponse.json(
        { message: "No transactions found for this client" },
        { status: 404 }
      );
    }

    return NextResponse.json(transactionsForClient, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions by client:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
