import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import dotenv from "dotenv";

dotenv.config();

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string; // Use string for simplicity (e.g., "YYYY-MM-DD")
  completed: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/tasks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const tasks = await response.json();
        setTasks(tasks.content);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (title.trim() && description.trim() && dueDate.trim()) {
      try {
        const response = await fetch(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/tasks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              description,
              dueDate,
              status: "IN_PROGRESS",
              priority: "HIGH",
              userId: 1,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);

        setTitle("");
        setDescription("");
        setDueDate("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
  };

  const saveTask = async () => {
    if (editingTask && title.trim() && description.trim() && dueDate.trim()) {
      try {
        const response = await fetch(
          `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/tasks/${editingTask.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              description,
              dueDate,
              completed: editingTask.completed,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTask.id ? updatedTask : task
          )
        );

        setEditingTask(null);
        setTitle("");
        setDescription("");
        setDueDate("");
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex max-w-full px-4 py-8 gap-8 h-screen">
        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1">
          <h2 className="text-2xl font-bold mb-6">
            {editingTask ? "Edit Task" : "Add a New Task"}
          </h2>
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
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="description"
            >
              Task Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
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
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />
          </div>
          <div className="flex gap-4">
            {editingTask ? (
              <>
                <button
                  onClick={saveTask}
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
                onClick={addTask}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium"
              >
                Add Task
              </button>
            )}
          </div>
        </section>

        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1">
          <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
          <ul className="space-y-4 flex-1 overflow-y-auto">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-col bg-gray-700 p-4 rounded-md"
                onClick={() => startEditingTask(task)}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-300">{task.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={task.completed || false}
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

      <footer className="bg-gray-800 text-center py-4">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} ProductivityMate. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
