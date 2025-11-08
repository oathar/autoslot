import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedUser extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token; // ✅ Get token from cookie

    if (!token) {
      res.status(401).json({ error: "No token, please login" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedUser;
    if (decoded.role !== "superadmin") {
      res.status(403).json({ error: "Access denied: SuperAdmin only" });
      return;
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
