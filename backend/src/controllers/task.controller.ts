import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// CREATE TASK
export const createTask = async (req: Request, res: Response) => {
  const { title } = req.body;
  const userId = (req as any).user.userId;

  const task = await prisma.task.create({
    data: {
      title,
      userId
    }
  });

  res.json(task);
};

// GET ALL TASKS (OF LOGGED IN USER)
export const getTasks = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const search = req.query.search as string;
  const status = req.query.status as string;

  const skip = (page - 1) * limit;

  const where: any = { userId };

  if (status === "completed") {
    where.completed = true;
  }

  if (status === "pending") {
    where.completed = false;
  }

  if (search) {
    where.title = {
      contains: search,
      
    };
  }

  const tasks = await prisma.task.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" }
  });

  res.json(tasks);
};


// UPDATE TASK TITLE
export const updateTask = async (req: Request, res: Response) => {
  const { title } = req.body;
  const taskId = Number(req.params.id);
  const userId = (req as any).user.userId;

  const task = await prisma.task.updateMany({
    where: { id: taskId, userId },
    data: { title }
  });

  res.json({ message: "Task updated", task });
};

// DELETE TASK
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = Number(req.params.id);
  const userId = (req as any).user.userId;

  await prisma.task.deleteMany({
    where: { id: taskId, userId }
  });

  res.json({ message: "Task deleted" });
};

// TOGGLE TASK (completed ↔ not completed)
export const toggleTask = async (req: Request, res: Response) => {
  const taskId = Number(req.params.id);
  const userId = (req as any).user.userId;

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId }
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed }
  });

  res.json(updated);
};
