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

// Configure CORS for production and development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  // Add your production frontend URL here
  // 'https://your-production-frontend.com'
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

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

const PORT: number = parseInt(process.env.PORT || "5858", 10);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;