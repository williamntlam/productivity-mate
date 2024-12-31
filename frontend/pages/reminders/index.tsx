import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import dotenv from "dotenv";
dotenv.config();

const API_BASE_URL = `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/reminders`;

type Reminder = {
  id: number;
  title: string;
  description: string;
  reminderDate: string; // Use string for simplicity (e.g., "YYYY-MM-DD")
  sent: boolean; // Indicates whether the reminder has been "sent"
  status: "PENDING" | "COMPLETED" | "CANCELLED"; // Matches ReminderStatus enum
  repeatFrequencyDays: number | null;
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [status, setStatus] = useState<"PENDING" | "COMPLETED" | "CANCELLED">(
    "PENDING"
  );
  const [repeatFrequencyDays, setRepeatFrequencyDays] = useState<number | null>(
    null
  );
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          return;
        }

        const response = await fetch(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/users/reminders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reminders = await response.json();
        setReminders(reminders);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchReminders();
  }, []);

  const addReminder = async () => {
    if (title.trim() && description.trim() && reminderDate.trim()) {
      if (repeatFrequencyDays !== null && repeatFrequencyDays < 0) {
        setMessage("Repeat frequency must be a non-negative number.");
        return;
      }

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          return;
        }

        const addedReminder = await fetch(`${API_BASE_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title,
            description,
            reminderDate,
            repeatFrequencyDays,
            status: "PENDING",
          }),
        });

        if (!addedReminder.ok) {
          const errorMessage = await addedReminder.text();
          throw new Error(
            `HTTP error! Status: ${addedReminder.status} - ${
              addedReminder.statusText || "Unknown error"
            }. Message: ${errorMessage}`
          );
        }

        setReminders((prevReminders) => [
          ...prevReminders,
          {
            id: Date.now(),
            title,
            description,
            reminderDate,
            sent: false,
            status,
            repeatFrequencyDays,
          },
        ]);
        setMessage("Reminder added successfully!");
        setTitle("");
        setDescription("");
        setReminderDate("");
        setStatus("PENDING");
        setRepeatFrequencyDays(null);
      } catch (error) {
        console.error("Error adding reminder:", error);
        setMessage("Failed to add reminder.");
      }
    }
  };

  const deleteReminder = async (id: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }

      const deletedReminder = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!deletedReminder.ok) {
        const errorMessage = await deletedReminder.text();
        throw new Error(
          `HTTP error! Status: ${deletedReminder.status} - ${
            deletedReminder.statusText || "Unknown error"
          }. Message: ${errorMessage}`
        );
      }

      setReminders((prevReminders) =>
        prevReminders.filter((reminder) => reminder.id !== id)
      );
      setMessage("Reminder deleted successfully!");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      setMessage("Failed to delete reminder.");
    }
  };

  const saveReminder = async () => {
    if (
      editingReminder &&
      title.trim() &&
      description.trim() &&
      reminderDate.trim() &&
      repeatFrequencyDays !== null
    ) {
      if (repeatFrequencyDays < 0) {
        setMessage("Repeat frequency must be a non-negative number.");
        return;
      }

      try {
        const updatedReminder = await fetch(
          `${API_BASE_URL}/${editingReminder.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              description,
              reminderDate,
              repeatFrequencyDays,
              status,
              id: editingReminder.id,
            }),
          }
        );

        if (!updatedReminder.ok) {
          const errorMessage = await updatedReminder.text();
          throw new Error(
            `HTTP error! Status: ${updatedReminder.status} - ${
              updatedReminder.statusText || "Unknown error"
            }. Message: ${errorMessage}`
          );
        }

        setReminders((prevReminders) =>
          prevReminders.map((reminder) =>
            reminder.id === editingReminder.id
              ? {
                  ...reminder,
                  title,
                  description,
                  reminderDate,
                  repeatFrequencyDays,
                  status,
                }
              : reminder
          )
        );

        setMessage("Reminder updated successfully!");
        cancelEditing();
      } catch (error) {
        console.error("Error updating reminder:", error);
        setMessage("Failed to update reminder.");
      }
    }
  };

  const startEditingReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setTitle(reminder.title);
    setDescription(reminder.description);
    setReminderDate(reminder.reminderDate);
    setStatus(reminder.status);
    setRepeatFrequencyDays(reminder.repeatFrequencyDays);
  };

  const cancelEditing = () => {
    setEditingReminder(null);
    setTitle("");
    setDescription("");
    setReminderDate("");
    setStatus("PENDING");
    setRepeatFrequencyDays(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 flex max-w-full px-4 py-8 gap-8">
        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1 h-full">
          <h2 className="text-2xl font-bold mb-6">
            {editingReminder ? "Edit Reminder" : "Add a New Reminder"}
          </h2>
          {message && <div className="mb-4 text-yellow-400">{message}</div>}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="reminderTitle"
            >
              Reminder Title
            </label>
            <input
              id="reminderTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter reminder title"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="reminderDescription"
            >
              Reminder Description
            </label>
            <textarea
              id="reminderDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter reminder description"
              rows={4}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="reminderDate"
            >
              Reminder Date
            </label>
            <input
              id="reminderDate"
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="status">
              Reminder Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Reminder["status"])}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="repeatFrequencyDays"
            >
              Repeat Frequency (Days)
            </label>
            <input
              id="repeatFrequencyDays"
              type="number"
              value={repeatFrequencyDays || ""}
              onChange={(e) =>
                setRepeatFrequencyDays(
                  e.target.value ? parseInt(e.target.value, 10) : null
                )
              }
              placeholder="Enter repeat frequency in days"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            {editingReminder ? (
              <>
                <button
                  onClick={saveReminder}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md font-medium"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={addReminder}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium"
              >
                Add Task
              </button>
            )}
          </div>
        </section>

        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1 h-full">
          <h2 className="text-2xl font-bold mb-6">My Reminders</h2>
          <ul className="space-y-4 flex-1 overflow-y-auto">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="flex flex-col bg-gray-700 p-4 rounded-md"
                onClick={() => startEditingReminder(reminder)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className={`text-lg font-semibold ${
                      reminder.sent ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {reminder.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReminder(reminder.id);
                    }}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p
                  className={`text-sm ${
                    reminder.sent ? "line-through text-gray-500" : ""
                  }`}
                >
                  {reminder.description}
                </p>
                <p className="text-sm text-gray-400">
                  Reminder Date: {reminder.reminderDate}
                </p>
                <p className="text-sm text-gray-400">
                  Status: {reminder.status}
                </p>
                {reminder.repeatFrequencyDays && (
                  <p className="text-sm text-gray-400">
                    Repeat Every: {reminder.repeatFrequencyDays} days
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
