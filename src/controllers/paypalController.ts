import type { Request, Response } from "express"
import PayPalClient from "../config/paypalClient.ts"
import type { PayPalOrder, PayPalCapture } from "../types/paypalTypes.ts";


class PayPalController {
  private paypalClient: typeof PayPalClient;

  constructor() {
    this.paypalClient = PayPalClient;
  };

  private logger = {
    error: (message: string, error: unknown) => {
      console.error(`Error [PayPal Controller]: ${message}`, error);
    },
    info: (message: string) => {
      console.log(`Info [PayPal Controller]: ${message}`);
    },
    success: (message: string) => {
      console.log(`Success [PayPal Controller]: ${message}`);
    }
  };

  // Create order
  public createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { items, totalAmount } = req.body;

      this.logger.info(`Creating order with total amount: ${totalAmount}`);

      const order = await this.paypalClient.request<PayPalOrder>("/v2/checkout/orders", {
        method: "POST",
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            amount: {
              currency_code: "USD",
              value: totalAmount.toFixed(2),
            },
            items: items
          }]
        }),
      });
      this.logger.success(`Order created with ID: ${order.id}`);
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      this.logger.error("Failed to create order", error);
    }
  };

  public captureOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderID } = req.params;

      this.logger.info(`Capturing order with ID: ${orderID}`);

      const capture = await this.paypalClient.request<PayPalCapture>(`/v2/checkout/orders/${orderID}/capture`, { method: "POST" });

      this.logger.success(`Order captured with ID: ${orderID}`);
      res.status(200).json(capture);
    } catch (error) {
      console.log(error);
      this.logger.error("Failed to capture order", error);}
  };
}

export default new PayPalController();

