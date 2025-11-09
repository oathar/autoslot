// server.ts
import express, { Application } from "express";
import dotenv from "dotenv";
import userRouter from "../routers/user.routes";
import documentRouter from "./routers/document.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { prisma } from "../lib/prisma";
import path from "path";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "5858", 10);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ], // Your React dev server URLs
  credentials: true, // Allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/documents", documentRouter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test database connection
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to Neon PostgreSQL database");
  } catch (err) {
    console.error("❌ Connection error:", err);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;