import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

// ✅ CORS FIX
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
