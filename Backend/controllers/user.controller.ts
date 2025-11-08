// controllers/user.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { generateToken } from "../utils/jwt";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        programs: true,
        semester: true,
        role: true,
      },
    });
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        username: true,
        email: true,
        programs: true,
        semester: true,
        role: true,
      },
    });

    if (!teacher) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, programs, semester, role } = req.body;
    console.log("Incoming password:", password);

    // Check if user already exists
    const existingUser = await prisma.teacher.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    // Create new user
    const newUser = await prisma.teacher.create({
      data: {
        username,
        email,
        password: hashedPassword,
        programs,
        semester,
        role: role || "TEACHER", // Default to TEACHER enum value
      },
      select: {
        id: true,
        username: true,
        email: true,
        programs: true,
        semester: true,
        role: true,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.teacher.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};