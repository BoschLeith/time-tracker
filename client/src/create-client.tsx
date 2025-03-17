import { FormEvent, useState } from "react";

export default function CreateClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newClient = { name, email, rate };

    try {
      const response = await fetch("http://localhost:5000/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        throw new Error("Failed to create client");
      }

      setSuccess("Client added successfully!");
      setError(null);
      setName("");
      setEmail("");
      setRate(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Client</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="client-name">
            Name
            <input
              type="text"
              id="client-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="client-email">
            Email
            <input
              type="email"
              id="client-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label htmlFor="client-rate">
            Rate
            <input
              type="number"
              id="client-rate"
              value={rate !== null ? rate : ""}
              onChange={(e) =>
                setRate(e.target.value ? Number(e.target.value) : null)
              }
            />
          </label>
        </div>
        <button type="submit" disabled={loading || !name || !email}>
          Add Client
        </button>
      </form>
      {error && <p>Error: {error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
}
