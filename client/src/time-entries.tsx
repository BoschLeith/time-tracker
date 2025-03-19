import { Pencil, SquarePlus, Trash } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

interface TimeEntry {
  id: number;
  clientId: number;
  date: string;
  duration: number | null;
  description: string | null;
}

interface Client {
  id: number;
  name: string;
  email: string;
  company: string | null;
  rate: number | null;
}

export default function TimeEntries() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [clients, setClients] = useState<Client[]>([]);

  const isFormValid =
    description.trim() !== "" &&
    date.trim() !== "" &&
    clientId !== null &&
    duration !== null &&
    !isNaN(duration) &&
    duration > 0;

  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/time-entries");

        if (!response.ok) {
          throw new Error("Failed to fetch time entries");
        }

        const { timeEntries } = await response.json();
        setTimeEntries(timeEntries);
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

    fetchTimeEntries();

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
    const modal = document.getElementById(
      "create_time_entry_modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCreateTimeEntry = async (e: FormEvent) => {
    e.preventDefault();

    if (!date || !description || clientId === null || duration === null) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/time-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          description,
          clientId,
          duration,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create time entry");
      }

      const { timeEntry } = await response.json();

      if (timeEntry) {
        setTimeEntries((prevTimeEntries) => [...prevTimeEntries, timeEntry]);

        const modal = document.getElementById(
          "create_time_entry_modal"
        ) as HTMLDialogElement;
        modal?.close();

        setDate("");
        setDescription("");
        setClientId(null);
        setDuration(null);
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

  const handleEditClick = (timeEntry: TimeEntry) => {
    setSelectedEntry(timeEntry);
    const modal = document.getElementById(
      "edit_time_entry_modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleDeleteClick = (timeEntry: TimeEntry) => {
    setSelectedEntry(timeEntry);
    const modal = document.getElementById(
      "delete_time_entry_modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="card card-border bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Time Entries</h2>
          <button
            className="btn ml-auto"
            onClick={() => {
              handleCreateClick();
            }}
          >
            <SquarePlus />
            Add Entry
          </button>
        </div>
        {timeEntries.length === 0 ? (
          <p>No clients available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Description</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.map((timeEntry) => {
                  const client = clients.find(
                    (c) => c.id === timeEntry.clientId
                  );

                  return (
                    <tr key={timeEntry.id}>
                      <td>{client ? client.name : "Unknown Client"}</td>
                      <td>{timeEntry.date}</td>
                      <td>{timeEntry.duration}</td>
                      <td>{timeEntry.description}</td>
                      <td className="text-right space-x-2">
                        <button
                          className="btn btn-square"
                          onClick={() => handleEditClick(timeEntry)}
                        >
                          <Pencil />
                        </button>
                        <button
                          className="btn btn-square"
                          onClick={() => handleDeleteClick(timeEntry)}
                        >
                          <Trash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Entry Modal */}
      <dialog
        id="create_time_entry_modal"
        className="modal"
        onClose={() => {
          setDate("");
          setDescription("");
          setClientId(null);
          setDuration(null);
        }}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Time Entry</h3>
          <div className="pb-2">Enter the details for the new time entry.</div>
          <form className="space-y-2" onSubmit={handleCreateTimeEntry}>
            <div>
              <label className="label" htmlFor="client">
                Client
              </label>
              <select
                id="client"
                value={clientId ?? ""}
                className="select w-full"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setClientId(selectedValue ? Number(selectedValue) : null);
                }}
              >
                <option value="" disabled>
                  Select a Client
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                placeholder="Wayne Enterprises"
                className="w-full input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="duration">
                Duration
              </label>
              <input
                type="number"
                id="duration"
                placeholder="Enter duration"
                className="w-full input"
                value={duration ?? ""}
                onChange={(e) =>
                  setDuration(e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>
            <div>
              <label className="label" htmlFor="description">
                Description
              </label>
              <input
                type="string"
                id="description"
                placeholder="Enter a description"
                className="w-full input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const modal = document.getElementById(
                    "create_time_entry_modal"
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
                Add Entry
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
