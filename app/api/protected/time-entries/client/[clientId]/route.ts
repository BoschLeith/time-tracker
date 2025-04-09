import { db } from "@/drizzle/db";
import { timeEntries } from "@/drizzle/schema";
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

    const timeEntriesForClient = await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.clientId, id));

    if (!timeEntriesForClient) {
      return NextResponse.json(
        { message: "No time entries found for this client" },
        { status: 404 }
      );
    }

    return NextResponse.json(timeEntriesForClient, { status: 200 });
  } catch (error) {
    console.error("Error fetching time entries by client:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
