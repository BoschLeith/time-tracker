import { db } from "@/drizzle/db";
import { transactions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const paramsId = (await params).id;
    const id = parseInt(paramsId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { clientId, amount, description } = await req.json();
    const paramsId = (await params).id;
    const id = parseInt(paramsId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid transactions ID" },
        { status: 400 }
      );
    }

    const [updatedTransaction] = await db
      .update(transactions)
      .set({ clientId, amount, description })
      .where(eq(transactions.id, id))
      .returning();

    if (!updatedTransaction) {
      return NextResponse.json(
        { message: "Transactions not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error("Error updating transactions:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const paramsId = (await params).id;
    const id = parseInt(paramsId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    const [deletedTransaction] = await db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning();

    if (!deletedTransaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
