import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState } from "react";

type Reminder = {
  id: number;
  title: string;
  description: string;
  reminderDate: string; // Use string for simplicity (e.g., "YYYY-MM-DD")
  sent: boolean; // Indicates whether the reminder has been "sent"
  status: "PENDING" | "COMPLETED" | "CANCELLED"; // Matches ReminderStatus enum
  repeatFrequencyDays: number | null; // Optional: number of days for repeat
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

  const addReminder = () => {
    if (title.trim() && description.trim() && reminderDate.trim()) {
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
      setTitle("");
      setDescription("");
      setReminderDate("");
      setStatus("PENDING");
      setRepeatFrequencyDays(null);
    }
  };

  const deleteReminder = (id: number) => {
    setReminders((prevReminders) => prevReminders.filter((r) => r.id !== id));
  };

  const markAsSent = (id: number) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, sent: true, status: "COMPLETED" }
          : reminder
      )
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex max-w-full px-4 py-8 gap-8">
        {/* Left Side: Add Reminder */}
        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1 h-full">
          <h2 className="text-2xl font-bold mb-6">Add a New Reminder</h2>
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
          <button
            onClick={addReminder}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium w-full mt-auto"
          >
            Add Reminder
          </button>
        </section>

        {/* Right Side: Reminder List */}
        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1 h-full">
          <h2 className="text-2xl font-bold mb-6">My Reminders</h2>
          <ul className="space-y-4 flex-1 overflow-y-auto">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="flex flex-col bg-gray-700 p-4 rounded-md"
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
                    onClick={() => deleteReminder(reminder.id)}
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
                <button
                  onClick={() => markAsSent(reminder.id)}
                  className={`mt-2 text-sm px-2 py-1 rounded-md ${
                    reminder.sent
                      ? "bg-green-500 text-gray-900"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {reminder.sent ? "Sent" : "Mark as Sent"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
