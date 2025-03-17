import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Client {
  id: number;
  name: string;
  email: string;
  rate: number | null;
}

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/clients");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClients(data.clients);
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

    fetchClients();
  }, []);

  if (loading) {
    return <article aria-busy="true"></article>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <nav>
        <ul>
          <li>
            <strong>Clients</strong>
          </li>
        </ul>
        <ul>
          <li>
            <button
              onClick={() => {
                navigate("create");
              }}
            >
              Create Client
            </button>{" "}
          </li>
        </ul>
      </nav>
      {clients.length === 0 ? (
        <p>No clients available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>
                  {client.rate !== null ? `${client.rate.toFixed(2)}` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
