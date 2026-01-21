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
  const [error, setError] = useState("");

  // 🔐 Auth Guard
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [router, token]);

  const fetchTasks = async () => {
    if (!token) return;

    let url = "http://localhost:4000/tasks?";
    if (search) url += `search=${search}&`;
    if (status !== "all") url += `status=${status}&`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load tasks");
        return;
      }

      setTasks(data);
    } catch {
      setError("Server error");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status]);

  const addTask = async () => {
    if (!title.trim() || !token) return;

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
    if (!token) return;

    await fetch(`http://localhost:4000/tasks/${id}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    if (!token) return;

    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      <button onClick={logout}>Logout</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ADD TASK */}
      <div>
        <input
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <hr />

      {/* SEARCH + FILTER */}
      <div>
        <input
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <hr />

      {/* TASK LIST */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none"
              }}
            >
              {task.title}
            </span>

            <button onClick={() => toggleTask(task.id)}>
              {task.completed ? "Undo" : "Done"}
            </button>

            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
