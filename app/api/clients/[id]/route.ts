import { db } from "@/drizzle/db";
import { clients } from "@/drizzle/schema";
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
        { message: "Invalid client ID" },
        { status: 400 }
      );
    }

    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    console.error("Error fetching client:", error);
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
    const { name, email, hourlyRate } = await req.json();
    const paramsId = (await params).id;
    const id = parseInt(paramsId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid client ID" },
        { status: 400 }
      );
    }

    const [updatedClient] = await db
      .update(clients)
      .set({ name, email, hourlyRate })
      .where(eq(clients.id, id))
      .returning();

    if (!updatedClient) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error("Error updating client:", error);
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
        { message: "Invalid client ID" },
        { status: 400 }
      );
    }

    const [deletedClient] = await db
      .delete(clients)
      .where(eq(clients.id, id))
      .returning();

    if (!deletedClient) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
