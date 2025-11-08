// controllers/schedule.controller.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const updateScheduleProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { completed_lectures, current_topic, next_topic } = req.body;

    const schedule = await prisma.schedule.update({
      where: { id: parseInt(id) },
      data: {
        completed_lectures,
        current_topic,
        next_topic,
      },
      include: {
        resources: true,
      },
    });

    res.status(200).json({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ error: "Failed to update schedule" });
  }
};

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schedule_id, teacher_id, present, absent, remarks } = req.body;

    const attendance = await prisma.attendance.create({
      data: {
        schedule_id,
        teacher_id,
        present,
        absent: absent || 0,
        remarks,
      },
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

export const addResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schedule_id, name, type, size, url } = req.body;

    const resource = await prisma.resource.create({
      data: {
        schedule_id,
        name,
        type,
        size,
        url,
      },
    });

    res.status(201).json({
      message: "Resource added successfully",
      resource,
    });
  } catch (error) {
    console.error("Error adding resource:", error);
    res.status(500).json({ error: "Failed to add resource" });
  }
};

export const getTodaySchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacher_id } = req.params;

    const schedules = await prisma.schedule.findMany({
      where: {
        teacher_id: parseInt(teacher_id),
      },
      include: {
        resources: true,
        attendances: {
          orderBy: {
            marked_at: 'desc',
          },
          take: 1,
        },
      },
    });

    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
};
