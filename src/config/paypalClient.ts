import axios, { AxiosError } from "axios"
import type { PayPalCaptureResponse, PayPalCreateOrderResponse, PayPalTokenResponse } from "../types/paypalTypes.js";

class PayPalClient {

  private paypalBaseUrl: string = process.env.PAYPAL_BASE_URL || '';
  private paypalApiBaseUrl: string = process.env.PAYPAL_API_BASE_URL || '';
  private clientId: string = process.env.PAYPAL_CLIENT_ID || '';
  private clientSecret: string = process.env.PAYPAL_CLIENT_SECRET || '';
  private accessToken: string | null = null;
  private accessTokenExpiresAt: number | null = null;

  constructor() {
    console.log('PayPalClient initialized')
  }

  /**
    * Retrieves a valid access token from PayPal
    * Caches the token until it expires
    */
  async getAccessToken(): Promise<string> {

    // If the token exists and has not expired, reuse it
    if (
      this.accessToken &&
      this.accessTokenExpiresAt &&
      Date.now() < this.accessTokenExpiresAt
    ) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret || !this.paypalBaseUrl) {
      throw new Error('PayPal environment variables are not configured: PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET')
    }

    try {
      const response = await axios.post<PayPalTokenResponse>(
        `${this.paypalBaseUrl}/v1/oauth2/token`,
        "grant_type=client_credentials",
        {
          auth: {
            username: this.clientId,
            password: this.clientSecret
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Expires 60 seconds earlier for safety
      this.accessTokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;

      console.log(`PayPal access token obtained: ${this.accessToken}`);
      console.log(`Token expires At: ${new Date(this.accessTokenExpiresAt).toISOString()}`);

      return this.accessToken;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Failed to get PayPal access token: ${axiosError.message}`);
      throw error;
    }
  }

  /**
    * Creates a new order in PayPal
    */
  async createOrder() {

    try {
      const accessToken = await this.getAccessToken()
      const response = await axios.post<PayPalCreateOrderResponse>(
        `${this.paypalBaseUrl}/v2/checkout/orders`,
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: "10.00",
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: "10.00"
                  }
                }
              },
              items: [
                {
                  name: "Laptop",
                  quantity: "1",
                  unit_amount: {
                    currency_code: "USD",
                    value: "10.00"
                  }
                }
              ]
            }
          ],
          application_context: {
            brand_name: "Web Page",
            landing_page: "NO_PREFERENCE",
            user_action: "PAY_NOW",
            return_url: `${this.paypalApiBaseUrl}/complete-order`,
            cancel_url: `${this.paypalApiBaseUrl}/cancel-order`,
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        },
      );

      console.log(response.data)
      console.log('PayPal order created with ID:', response.data.id);
      console.log('PayPal order URL', response.data.links.find((link: any) => link.rel === 'approve')?.href)
      return { orderID: response.data.id, approveLink: response.data.links.find((link: any) => link.rel === 'approve')?.href };

    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Failed to create PayPal order: ${axiosError.message}`);
      throw error;
    }
  }

  async capturePayment(orderID: string): Promise<PayPalCaptureResponse> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await axios.post(
        `${this.paypalBaseUrl}/v2/checkout/orders/${orderID}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        }
      )

      console.log(response.data)
      console.log(`Payment captured for order ID: ${orderID}`);
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Failed to capture payment for order: ${axiosError.message}`);
      throw error;
    }
  }

}

export default new PayPalClient()
