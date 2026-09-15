import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, secretKey);
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error("JWT_SECRET is not defined in environment variables");
    const decoded = jwt.verify(token, secretKey) as { role?: string };
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    res.status(403).json({ message: "Admin access required" });
  }
}