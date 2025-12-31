import type { Request, Response } from 'express';
import paypalService from '../services/paypalService.ts';

class PayPalController {

  constructor() { }

  // PayPalOrder controlers

  // CREATE a new order controler
  async createOrder(req: Request, res: Response) {
    try {
      const order = await paypalService.createOrder();
      res.status(200).json(order)
    } catch (error) {
      res.status(500).json({ message: "Error creating order", error })
    }
  }

  // Complete order
  async completeOrder(req: Request, res: Response) {
    try {
      const token = req.query.token as string;

      if (!token) {
        return res.status(400).send('Missing token parameter');
      }

      const captureResponse = await paypalService.capturePayment(token);
      res.status(200).send(captureResponse)
    } catch (error) {
      res.status(500).json({ message: "Error capturing PAyPal payment", error })
    }
  }

  // Cancel order
  async cancelOrder(req: Request, res: Response) {
    try {
      res.redirect('/')
    } catch (error) {
      res.status(500).send(error)
    }
  }
}

export default new PayPalController();