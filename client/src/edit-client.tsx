import { FormEvent, useState, useEffect } from "react";
import { useParams } from "react-router";

export default function EditClient() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clients/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch client data");
        }
        const { client } = await response.json();
        setName(client.name);
        setEmail(client.email);
        setRate(client.rate);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedClient = { name, email, rate };

    try {
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClient),
      });

      if (!response.ok) {
        throw new Error("Failed to update client");
      }

      setSuccess("Client updated successfully!");
      setError(null);
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

  if (loading) {
    return <article aria-busy="true"></article>;
  }

  return (
    <div>
      <h1>Edit Client</h1>
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
          Update Client
        </button>
      </form>
      {error && <p>Error: {error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
}
