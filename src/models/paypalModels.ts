import { PayPalCaptureResponseSchema, PayPalCreateOrderResponseSchema, PayPalTokenResponseSchema } from '../schemas/paypalSchemas.ts';
import type { PayPalLinkType } from '../schemas/paypalSchemas.ts';

class PayPalModel {

  // Token Models

  static parseToken(response: unknown) {
    const result = PayPalTokenResponseSchema.parse(response);

    return {
      accessToken: result.access_token,
      expiresIn: result.expires_in,
    };
  }

  // Create Order Models

  static parseCreateOrder(response: unknown) {
    const result = PayPalCreateOrderResponseSchema.parse(response);

    const approveLink = result.links.find((link: PayPalLinkType) => link.rel === 'approve');
    if (!approveLink) {
      throw new Error('Approve link not found in PayPal create order response');
    }
    return {
      orderID: result.id,
      approveLink: approveLink.href,
    };
  }

  // Capture Payment Model

  static parseCapturePayment(response: unknown) {
    const capture = PayPalCaptureResponseSchema.parse(response);
    return {
      paymentID: capture.id,
      status: capture.status,
      payer: capture.payer,
    };
  }

}

export default PayPalModel;
