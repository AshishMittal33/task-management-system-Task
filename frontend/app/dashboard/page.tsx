"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const fetchTasks = async () => {
    if (!token) {
      setError("Not logged in");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/tasks", {
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
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });

      if (!res.ok) {
        setError("Failed to add task");
        return;
      }

      setTitle("");
      fetchTasks();
    } catch {
      setError("Server error");
    }
  };

  const toggleTask = async (id: number) => {
    await fetch(`http://localhost:4000/tasks/${id}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchTasks();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

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
