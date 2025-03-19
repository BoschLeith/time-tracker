import { FormEvent, useEffect, useState } from "react";

interface Client {
  id: number;
  name: string;
  email: string;
  company: string | null;
  rate: number | null;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  const isFormValid =
    name.trim() !== "" &&
    company.trim() !== "" &&
    email.trim() !== "" &&
    rate !== null;

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

  const handleCreateClick = () => {
    setName("");
    setEmail("");
    setCompany("");
    setRate(null);

    const modal = document.getElementById(
      "create_client_modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCreateClient = async (e: FormEvent) => {
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
          company,
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
        setCompany("");
        setRate(null);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setName(client.name);
    setEmail(client.email);
    setCompany(client.company ?? "");
    setRate(client.rate ?? null);
    const modal = document.getElementById(
      "edit_client_modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleEditClient = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${selectedClient.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            company,
            rate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit client");
      }

      const { client } = await response.json();

      if (client) {
        setClients(clients.map((c) => (c.id === client.id ? client : c)));

        const modal = document.getElementById(
          "edit_client_modal"
        ) as HTMLDialogElement;
        modal?.close();
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    const modal = document.getElementById(
      "delete_client_modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleDeleteClient = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${selectedClient.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      const { client } = await response.json();

      if (client) {
        setClients(clients.filter((c) => c.id !== client.id));

        const modal = document.getElementById(
          "delete_client_modal"
        ) as HTMLDialogElement;
        modal?.close();
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
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
              handleCreateClick();
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
                  <th>Company</th>
                  <th>Email</th>
                  <th>Rate</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.company}</td>
                    <td>{client.email}</td>
                    <td>
                      {client.rate !== null
                        ? `${client.rate.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="text-right">
                      <button
                        className="btn"
                        onClick={() => handleEditClick(client)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDeleteClick(client)}
                      >
                        Delete
                      </button>
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
          setCompany("");
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
                placeholder="Bruce Wayne"
                className="w-full input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="company">
                <span className="text-base label-text">Company</span>
              </label>
              <input
                type="text"
                id="company"
                placeholder="Wayne Enterprises"
                className="w-full input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
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

      {/* Edit Client Modal */}
      <dialog
        id="edit_client_modal"
        className="modal"
        onClose={() => {
          setSelectedClient(null);
        }}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Client</h3>
          <div className="pb-2">Edit the client</div>
          <form className="space-y-2" onSubmit={handleEditClient}>
            <div>
              <label className="label" htmlFor="name">
                <span className="text-base label-text">Name</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Bruce Wayne"
                className="w-full input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="company">
                <span className="text-base label-text">Company</span>
              </label>
              <input
                type="text"
                id="company"
                placeholder="Wayne Enterprises"
                className="w-full input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
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
                  setSelectedClient(null);
                  const modal = document.getElementById(
                    "edit_client_modal"
                  ) as HTMLDialogElement;
                  modal?.close();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isFormValid}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Delete Client Modal */}
      <dialog
        id="delete_client_modal"
        className="modal"
        onClose={() => {
          setSelectedClient(null);
        }}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Client</h3>
          <div className="pb-2"></div>
          <form className="space-y-2" onSubmit={handleDeleteClient}>
            <div>
              Are you sure you want to delete this client? This action cannot be
              undone.
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setSelectedClient(null);
                  const modal = document.getElementById(
                    "delete_client_modal"
                  ) as HTMLDialogElement;
                  modal?.close();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-error">
                Delete
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
