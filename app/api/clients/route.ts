import { db } from "@/drizzle/db";
import { clients } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allClients = await db.select().from(clients);
    return NextResponse.json(allClients, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, hourlyRate } = await req.json();

    const [newClient] = await db
      .insert(clients)
      .values({ name, email, hourlyRate })
      .returning();

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
