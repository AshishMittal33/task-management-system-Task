import dotenv from "dotenv";
dotenv.config();

import express from "express";
import taskRoutes from "./routes/task.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

app.listen(4000, () => {
  console.log("Server running on 4000");
});
