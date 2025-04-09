import { db } from "@/drizzle/db";
import { timeEntries } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allTimeEntries = await db.select().from(timeEntries);
    return NextResponse.json(allTimeEntries, { status: 200 });
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      userId,
      clientId,
      description,
      projectId,
      date,
      startTime,
      endTime,
      duration,
    } = await req.json();

    const [newTimeEntry] = await db
      .insert(timeEntries)
      .values({
        userId,
        clientId,
        description,
        projectId,
        date,
        startTime,
        endTime,
        duration,
      })
      .returning();

    return NextResponse.json(newTimeEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating time entry:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
