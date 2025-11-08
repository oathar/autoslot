// controllers/request.controller.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, from_id, details } = req.body;

    const request = await prisma.request.create({
      data: {
        type,
        from_id,
        details,
      },
      include: {
        from: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Failed to create request" });
  }
};

export const approveRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { approved_by } = req.body;

    const request = await prisma.request.update({
      where: { id: parseInt(id) },
      data: {
        status: "APPROVED",
        approved_by,
        approved_at: new Date(),
      },
      include: {
        from: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Request approved successfully",
      request,
    });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ error: "Failed to approve request" });
  }
};

export const rejectRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { approved_by } = req.body;

    const request = await prisma.request.update({
      where: { id: parseInt(id) },
      data: {
        status: "REJECTED",
        approved_by,
        approved_at: new Date(),
      },
      include: {
        from: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Request rejected successfully",
      request,
    });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ error: "Failed to reject request" });
  }
};

export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const requests = await prisma.request.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        from: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

export const getRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await prisma.request.findUnique({
      where: { id: parseInt(id) },
      include: {
        from: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!request) {
      res.status(404).json({ error: "Request not found" });
      return;
    }

    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Failed to fetch request" });
  }
};
