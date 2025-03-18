import { useEffect, useState } from "react";

interface Client {
  id: number;
  name: string;
  email: string;
  rate: number | null;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  const isFormValid =
    name.trim() !== "" && email.trim() !== "" && rate !== null;

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

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || rate === null) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          rate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create client");
      }

      const { client } = await response.json();

      if (client) {
        setClients((prevClients) => [...prevClients, client]);

        const modal = document.getElementById(
          "create_client_modal"
        ) as HTMLDialogElement;
        modal?.close();

        setName("");
        setEmail("");
        setRate(null);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

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
          <button
            className="btn ml-auto"
            onClick={() => {
              const modal = document.getElementById(
                "create_client_modal"
              ) as HTMLDialogElement;
              modal?.showModal();
            }}
          >
            Add Client
          </button>
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
                  <th className="text-right">Actions</th>
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
                    <td className="text-right">
                      <button className="btn">Edit</button>
                      <button className="btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Client Modal */}
      <dialog
        id="create_client_modal"
        className="modal"
        onClose={() => {
          setName("");
          setEmail("");
          setRate(null);
        }}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Client</h3>
          <div className="pb-2">Enter the details for the new client.</div>
          <form className="space-y-2" onSubmit={handleCreateClient}>
            <div>
              <label className="label" htmlFor="name">
                <span className="text-base label-text">Name</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Leeroy Jenkins"
                className="w-full input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="email">
                <span className="text-base label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="mail@site.com"
                className="w-full input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="rate">
                <span className="text-base label-text">Rate</span>
              </label>
              <input
                type="number"
                id="rate"
                placeholder="00.00"
                className="w-full input"
                value={rate ?? ""}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const modal = document.getElementById(
                    "create_client_modal"
                  ) as HTMLDialogElement;
                  modal?.close();
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isFormValid}
              >
                Add Client
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
