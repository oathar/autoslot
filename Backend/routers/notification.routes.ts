import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
} from "../controllers/notification.controller";

const router = Router();

// Get all notifications for a teacher
router.get("/:teacherId", getNotifications);

// Get unread count
router.get("/:teacherId/unread-count", getUnreadCount);

// Mark as read
router.put("/:id/read", markAsRead);

// Mark all as read
router.put("/:teacherId/read-all", markAllAsRead);

// Create notification
router.post("/", createNotification);

// Delete notification
router.delete("/:id", deleteNotification);

export default router;
