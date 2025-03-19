import cors from "cors";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import express from "express";

import { clients, timeEntries } from "./db/schema";

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
  const allClients = await db.select().from(clients);
  res.json({ clients: allClients });
});

app.get("/api/clients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "ID is required." });
    }

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, Number(id)));

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
    const { name, email, company, rate } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const [client] = await db
      .insert(clients)
      .values({ name, email, company, rate })
      .returning();

    return res.status(201).json({ client });
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
    if (!id) {
      return res.status(400).json({ error: "ID is required." });
    }

    if (!name && !email && !rate) {
      return res
        .status(400)
        .json({ error: "Name, email or rate are required." });
    }

    const [updatedClient] = await db
      .update(clients)
      .set({ name, email, rate })
      .where(eq(clients.id, Number(id)))
      .returning();

    return res.status(200).json({ client: updatedClient });
  } catch (error) {
    console.error("Error updating client:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the client." });
  }
});

app.delete("/api/clients/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "ID is required." });
    }

    const [deletedClient] = await db
      .delete(clients)
      .where(eq(clients.id, Number(id)))
      .returning();

    return res.status(200).json({ client: deletedClient });
  } catch (error) {
    console.error("Error deleting client:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the client." });
  }
});

app.get("/api/time-entries", async (req, res) => {
  const allTimeEntries = await db.select().from(timeEntries);
  res.json({ timeEntries: allTimeEntries });
});

app.get("/api/time-entries/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "ID is required." });
    }

    const [timeEntry] = await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.id, Number(id)));

    return res.status(200).json({ timeEntry });
  } catch (error) {
    console.error("Error fetching time entry:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the time entry." });
  }
});

app.post("/api/time-entries", async (req, res) => {
  try {
    const { clientId, date, duration, description } = req.body;

    if (!clientId || !date || !duration || !description) {
      return res.status(400).json({
        error: "Client ID, date, duration, and description are required.",
      });
    }

    const [timeEntry] = await db
      .insert(timeEntries)
      .values({ clientId, date, duration, description })
      .returning();

    return res.status(201).json({ timeEntry });
  } catch (error) {
    console.error("Error adding time entry:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the time entry." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
