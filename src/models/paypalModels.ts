import { PayPalCaptureResponseSchema, PayPalCreateOrderResponseSchema, PayPalCreateOrderResultSchema, PayPalTokenResponseSchema, PayPalTokenResultSchema } from '../schemas/paypalSchemas.ts';
import type { PayPalCaptureResponseType, PayPalCreateOrderResultType, PayPalTokenResultType } from '../types/paypalTypes.ts';

class PayPalModel {

  // Token Models

  static parseToken(response: unknown): PayPalTokenResultType {
    const result = PayPalTokenResponseSchema.parse(response);

    return PayPalTokenResultSchema.parse({
      accessToken: result.access_token,
      expiresIn: result.expires_in,
    });
  }

  // Create Order Models

  static parseCreateOrder(response: unknown): PayPalCreateOrderResultType {
    const result = PayPalCreateOrderResponseSchema.parse(response);

    const approveLink = result.links.find(link => link.rel === 'approve')
    if (!approveLink) {
      throw new Error('Approve link not found in PayPal create order response');
    }
    return PayPalCreateOrderResultSchema.parse({
      orderID: result.id,
      approveLink: approveLink.href,
    });
  }

  // Capture Payment Model

  static parseCapturePayment(response: unknown): PayPalCaptureResponseType {
    return PayPalCaptureResponseSchema.parse(response);
  }

}

export default PayPalModel;
