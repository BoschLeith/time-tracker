import cors from "cors";
import "dotenv/config";
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
