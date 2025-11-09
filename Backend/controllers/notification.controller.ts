import { Request, Response } from "express";
import prisma from "../generated/prisma/index";

// Get all notifications for a teacher
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacherId } = req.params;

    const notifications = await prisma.notification.findMany({
      where: { teacher_id: parseInt(teacherId) },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Get unread notification count
export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacherId } = req.params;

    const count = await prisma.notification.count({
      where: { 
        teacher_id: parseInt(teacherId),
        read: false 
      },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacherId } = req.params;

    await prisma.notification.updateMany({
      where: { 
        teacher_id: parseInt(teacherId),
        read: false 
      },
      data: { read: true },
    });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
};

// Create notification
export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacher_id, title, message, type, link } = req.body;

    const notification = await prisma.notification.create({
      data: {
        teacher_id,
        title,
        message,
        type: type || 'INFO',
        link,
      },
    });

    res.status(201).json({ message: "Notification created", notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
