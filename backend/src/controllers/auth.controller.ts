import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { prisma } from "../prisma/client";

// REGISTER
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  const token = generateToken({ userId: user.id });

  res.json({
    message: "Register successful",
    token
  });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ userId: user.id });

  res.json({
    message: "Login successful",
    token
  });
};
