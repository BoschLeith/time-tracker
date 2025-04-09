import { db } from "@/drizzle/db";
import { timeEntries } from "@/drizzle/schema";
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
        { message: "Invalid time entry ID" },
        { status: 400 }
      );
    }

    const [timeEntry] = await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.id, id));

    if (!timeEntry) {
      return NextResponse.json(
        { message: "Time entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(timeEntry, { status: 200 });
  } catch (error) {
    console.error("Error fetching time entry:", error);
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
    const {
      clientId,
      description,
      projectId,
      date,
      startTime,
      endTime,
      duration,
    } = await req.json();
    const paramsId = (await params).id;
    const id = parseInt(paramsId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid time entry ID" },
        { status: 400 }
      );
    }

    const [updatedTimeEntry] = await db
      .update(timeEntries)
      .set({
        clientId,
        description,
        date,
        projectId,
        startTime,
        endTime,
        duration,
      })
      .where(eq(timeEntries.id, id))
      .returning();

    if (!updatedTimeEntry) {
      return NextResponse.json(
        { message: "Time entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTimeEntry, { status: 200 });
  } catch (error) {
    console.error("Error updating time entry:", error);
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
        { message: "Invalid time entry ID" },
        { status: 400 }
      );
    }

    const [deletedTimeEntry] = await db
      .delete(timeEntries)
      .where(eq(timeEntries.id, id))
      .returning();

    if (!deletedTimeEntry) {
      return NextResponse.json(
        { message: "Time entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Time entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting time entry:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
