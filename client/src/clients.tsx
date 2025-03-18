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
        const { clients } = await response.json();
        setClients(clients);
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
    <div className="card card-border bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
          <button className="btn ml-auto">Add Client</button>
        </div>
        {clients.length === 0 ? (
          <p>No clients available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>
                      {client.rate !== null
                        ? `${client.rate.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td>
                      <button onClick={() => navigate(`edit/${client.id}`)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
