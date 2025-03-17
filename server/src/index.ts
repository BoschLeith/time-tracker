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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
