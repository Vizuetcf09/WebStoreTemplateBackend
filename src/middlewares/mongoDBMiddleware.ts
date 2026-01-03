import type { Request, Response, NextFunction } from "express";
import MongoDBClient from "../config/mongoDBClient.js";

export default async function mongoDBMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!MongoDBClient.isConnected()) {
      await MongoDBClient.connectDB();
    }
    next();
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error instanceof Error ? error.message : error
    );

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}
