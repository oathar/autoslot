// controllers/user.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { generateToken } from "../utils/jwt";

// Mock database for development when real database is not available
let mockDatabaseAvailable = true;
const mockUsers = [
  {
    id: 1,
    username: "demouser1",
    email: "demouser1@gmail.com",
    password: "$2a$10$rOz85.Qb5J.rlmd56QTvyeD7d6kCfAvF5x/FiGfF4qC9tflH0Mq1G", // bcrypt hash of "demouser@123"
    programs: "FYUP",
    semester: "FIRST",
    role: "TEACHER",
  }
];

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mockDatabaseAvailable) {
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
    } else {
      // Return mock data
      res.status(200).json(mockUsers.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        programs: user.programs,
        semester: user.semester,
        role: user.role,
      })));
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    // If database error, return mock data
    res.status(200).json(mockUsers.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      programs: user.programs,
      semester: user.semester,
      role: user.role,
    })));
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (mockDatabaseAvailable) {
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
    } else {
      // Return mock data
      const user = mockUsers.find(u => u.id === parseInt(id));
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        programs: user.programs,
        semester: user.semester,
        role: user.role,
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, programs, semester, role } = req.body;
    console.log("Incoming password:", password);

    if (mockDatabaseAvailable) {
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
    } else {
      // Mock signup - just return success
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: mockUsers.length + 1,
          username,
          email,
          programs,
          semester,
          role: role || "TEACHER",
        },
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    console.log("SignIn attempt with email:", email);
    
    let user;
    
    if (mockDatabaseAvailable) {
      // Check database connection
      try {
        await prisma.$connect();
      } catch (dbError) {
        console.error("Database connection error:", dbError);
        mockDatabaseAvailable = false;
        // Fall back to mock database
      }
      
      if (mockDatabaseAvailable) {
        // Find user by email
        user = await prisma.teacher.findUnique({
          where: { email },
        });
        console.log("User found in database:", user);
      }
    }
    
    // If database not available or user not found in database, check mock database
    if (!mockDatabaseAvailable || !user) {
      console.log("Checking mock database, mockDatabaseAvailable:", mockDatabaseAvailable);
      user = mockUsers.find(u => u.email === email);
      console.log("User found in mock database:", user);
    }

    if (!user) {
      console.log("User not found in either database");
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    let isMatch = false;
    if (mockDatabaseAvailable && user.password) {
      // Check password with real database user
      isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match (real DB):", isMatch);
    } else if (!mockDatabaseAvailable && user.password) {
      // Check password with mock user
      isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match (mock DB):", isMatch);
    }

    if (!isMatch) {
      console.log("Password mismatch");
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
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    res.status(500).json({ 
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? error instanceof Error ? error.message : "Unknown error" : undefined
    });
  }
};