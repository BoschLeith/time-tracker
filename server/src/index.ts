import cors from "cors";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import express from "express";

import { clientsTable } from "./db/schema";

const app = express();
const PORT = process.env.PORT || 5000;

const db = drizzle(process.env.DB_FILE_NAME!);

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/api/clients", async (req, res) => {
  const clients = await db.select().from(clientsTable);
  res.json({ clients });
});

app.get("/api/clients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "ID is required." });
    }

    const [client] = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.id, Number(id)));

    return res.status(200).json({ client });
  } catch (error) {
    console.error("Error fetching client:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the client." });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const { name, email, rate } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const newClient = await db
      .insert(clientsTable)
      .values({ name, email, rate })
      .returning();

    return res.status(201).json({ client: newClient });
  } catch (error) {
    console.error("Error adding client:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the client." });
  }
});

app.put("/api/clients/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, rate } = req.body;

  try {
    if (!name && !email && !rate) {
      return res
        .status(400)
        .json({ error: "Name, email or rate are required." });
    }

    const [updatedClient] = await db
      .update(clientsTable)
      .set({ name, email, rate })
      .where(eq(clientsTable.id, Number(id)))
      .returning();

    return res.status(200).json({ client: updatedClient });
  } catch (error) {
    console.error("Error updating client:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the client." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
