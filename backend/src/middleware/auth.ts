import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";

export interface AuthRequest extends Request {
  user?: { userId: string; email?: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
