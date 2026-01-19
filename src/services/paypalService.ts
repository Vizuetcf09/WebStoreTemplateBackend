import PayPalClient from "../config/paypalClient.js";
import PayPalModel from "../models/paypalModels.js";
import { StoreProductsTypes } from "../types/storeProductTypes.js";

class PayPalService {

  async getAccessToken() {
    const accessToken = await PayPalClient.getAccessToken();
    return PayPalModel.parseToken(accessToken);
  }

  async createOrder(product: StoreProductsTypes) {
    const orderResponse = await PayPalClient.createOrder(product);
    return PayPalModel.parseCreateOrder(orderResponse);
  }

  async capturePayment(orderId: string) {
    const captureResponse = await PayPalClient.capturePayment(orderId);
    return PayPalModel.parseCapturePayment(captureResponse);
  }

}

export default new PayPalService();