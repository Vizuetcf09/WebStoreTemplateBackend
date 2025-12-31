import type { Request, Response, NextFunction } from 'express';
import MongoDBClient from '../config/mongoDBClient.ts';

export default function mongoDBMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!MongoDBClient.isConnected()) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  next();
}