import type { Request, Response } from 'express';
import paypalService from '../services/paypalService.ts';
import { success, ZodError } from 'zod';

class PayPalController {

  constructor() { }

  // PayPalOrder controlers

  // CREATE a new order controler
  async createOrder(req: Request, res: Response) {
    try {
      const order = await paypalService.createOrder();
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ success: false, message: "Validation error", issues: error.issues });
      }

      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
      }
      res.status(500).json({ success: false, message: "Unknown error occurred" });
    }
  }

  // Complete order
  async completeOrder(req: Request, res: Response) {
    try {
      const token = req.query.token as string;

      if (!token) {
        return res.status(400).send({ success: false, message: 'Missing token parameter' });
      }

      const captureResponse = await paypalService.capturePayment(token);

      res.status(200).send({ success: true, data: captureResponse });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ success: false, message: "Validation error", issues: error.issues });
      }

      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
      }
      res.status(500).json({ success: false, message: "Error capturing PAyPal payment", error })
    }
  }

  // Cancel order
  async cancelOrder(req: Request, res: Response) {
    res.redirect('/')
  }

}


export default new PayPalController();