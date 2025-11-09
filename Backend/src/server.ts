// server.ts
import express, { Application } from "express";
import dotenv from "dotenv";
import userRouter from "../routers/user.routes";
import scheduleRouter from "../routers/schedule.routes";
import requestRouter from "../routers/request.routes";
import notificationRouter from "../routers/notification.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { prisma } from "../lib/prisma";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "5858", 10);

app.use(cors({
  origin: 'http://localhost:5173', // Your React dev server URL
  credentials: true, // Allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/schedules", scheduleRouter);
app.use("/requests", requestRouter);
app.use("/notifications", notificationRouter);

// Test database connection
(async () => {
  try {
    console.log("Attempting to connect to database...");
    await prisma.$connect();
    console.log("✅ Connected to database");
  } catch (err) {
    console.error("❌ Database connection failed!");
    if (err instanceof Error) {
      console.error("Error:", err.message);
    }
    console.error("⚠️ Please check your DATABASE_URL in .env file");
    console.error("⚠️ Server will start but database operations will fail");
  }
})();

// Graceful shutdown
process.on("beforeExit", async () => {
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.warn("⚠️ Error disconnecting from database:", err);
  }
});

process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.warn("⚠️ Error disconnecting from database:", err);
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;