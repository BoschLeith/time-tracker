import { db } from "@/drizzle/db";
import { clients } from "@/drizzle/schema";

export async function GET() {
  const allClients = await db.select().from(clients);
  return new Response(JSON.stringify(allClients), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
