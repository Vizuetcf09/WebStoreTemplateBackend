import type { Request, Response } from 'express';
import PayPalClient from '../config/paypalClient.ts';

class PayPalController {

  constructor() { }

  // PayPalOrder controlers

  // CREATE a new order controler
  async createOrder(req: Request, res: Response) {
    try {

      const order = await PayPalClient.createOrder();
      res.json(order)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  // Complete order
  async completeOrder(req: Request, res: Response) {
    try {
      PayPalClient.capturePayment(req.query.token);
      res.send('Purchase is successfully')
    } catch (error) {
      res.status(500).send(error)
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