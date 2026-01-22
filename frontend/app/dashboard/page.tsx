"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [router, token]);

 const fetchTasks = async () => {
  if (!token) return;

  let url = "http://localhost:4000/tasks?";
  if (search) url += `search=${search}&`;
  if (status !== "all") url += `status=${status}&`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    // 🔐 IMPORTANT FIX
    if (!Array.isArray(data)) {
      setTasks([]);
      return;
    }

    setTasks(data);
  } catch (err) {
    setTasks([]);
  }
};


  useEffect(() => {
    fetchTasks();
  }, [search, status]);

  const addTask = async () => {
    if (!title.trim()) return;

    await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });

    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (id: number) => {
    await fetch(`http://localhost:4000/tasks/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <button
          onClick={logout}
          className="text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded-lg px-4 py-2"
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded-lg px-4 py-2"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <span
              className={task.completed ? "line-through text-gray-400" : ""}
            >
              {task.title}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(task.id)}
                className="text-sm text-blue-600"
              >
                {task.completed ? "Undo" : "Done"}
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
