import Navbar from "@/components/Navbar";
import { useState } from "react";

type Task = {
  id: number;
  title: string;
  body: string;
  dueDate: string; // Use string for simplicity (e.g., "YYYY-MM-DD")
  completed: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dueDate, setDueDate] = useState("");

  const addTask = () => {
    if (title.trim() && body.trim() && dueDate.trim()) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now(), title, body, dueDate, completed: false },
      ]);
      setTitle("");
      setBody("");
      setDueDate("");
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex max-w-full px-4 py-8 gap-8 h-screen">
        {/* Left Side: Add Task */}
        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1">
          <h2 className="text-2xl font-bold mb-6">Add a New Task</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="title">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="body">
              Task Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter task description"
              rows={4}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="dueDate">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium w-full mt-auto"
          >
            Add Task
          </button>
        </section>

        {/* Right Side: Task List */}
        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1">
          <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
          <ul className="space-y-4 flex-1 overflow-y-auto">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-col bg-gray-700 p-4 rounded-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className={`text-lg font-semibold ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p
                  className={`text-sm ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.body}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Due: {task.dueDate}
                  </span>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="w-4 h-4"
                    />
                    Mark as Completed
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-4">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} ProductivityMate. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
