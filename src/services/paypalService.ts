import PayPalClient from "../config/paypalClient.js";
import PayPalModel from "../models/paypalModels.js";

class PayPalService {

  async getAccessToken() {
    const accessToken = await PayPalClient.getAccessToken();
    return PayPalModel.parseToken(accessToken);
  }

  async createOrder() {
    const orderResponse = await PayPalClient.createOrder();
    return PayPalModel.parseCreateOrder(orderResponse);
  }

  async capturePayment(orderID: string) {
    const captureResponse = await PayPalClient.capturePayment(orderID);
    return PayPalModel.parseCapturePayment(captureResponse);
  }

}

export default new PayPalService();