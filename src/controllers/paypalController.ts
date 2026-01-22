import { Request, Response } from 'express';
import paypalService from '../services/paypalService.js';
import { any, ZodError } from 'zod';
import { StoreProductsTypes } from '../types/storeProductTypes.js';

class PayPalController {
  private frontendBaseUrl = 'https://frontendwebpage.vercel.app';

  constructor() {
  }

  // PayPalOrder controlers

  // CREATE a new order controler
  async createOrder(req: Request, res: Response) {
    try {
      const storeProductInfo: StoreProductsTypes = req.body;

      // Validación simple si no usas Zod para todo
      if (!storeProductInfo.productName || !storeProductInfo.productPrice) {
        return res.status(400).json({
          success: false,
          message: "Faltan datos del producto (nombre o precio)."
        });
      }

      const order: any = await paypalService.createOrder(storeProductInfo);


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
    console.log(`Redirigiendo a: ${this.frontendBaseUrl}`);

    try {
      const token = req.query.token as string;

      if (!token) {
        console.error("No se recibió token de PayPal");
        return res.redirect('https://angularwebstore.vercel.app/checkout/cancel');
      }

      await paypalService.capturePayment(token);

      return res.redirect(`https://angularwebstore.vercel.app/checkout/success?token=${token}`);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ success: false, message: "Validation error", issues: error.issues });
      }

      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
      }
      console.error("Error en completeOrder:", error);
      return res.redirect('https://angularwebstore.vercel.app/checkout/cancel')
    }
  }

  // Cancel order
  async cancelOrder(req: Request, res: Response) {
    return res.redirect('https://angularwebstore.vercel.app/checkout/cancel')
  }

}

export default new PayPalController();