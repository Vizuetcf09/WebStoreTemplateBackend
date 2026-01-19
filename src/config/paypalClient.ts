import axios, { AxiosError } from "axios"
import { StoreProductsTypes } from "../types/storeProductTypes.js";

class PayPalClient {

  private baseUrl = process.env.BASE_URL;
  private paypalApiBaseUrl = `${this.baseUrl}/api/paypal` || '';
  private paypalBaseUrl = process.env.PAYPAL_BASE_URL || '';
  private clientId = process.env.PAYPAL_CLIENT_ID || '';
  private clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

  private accessToken: string = '';
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

    if (!this.clientId || !this.clientSecret || !this.baseUrl || !this.paypalBaseUrl) {
      throw new Error('PayPal environment variables are not configured: BASE_URL, PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_URL');
    }

    try {
      const response = await axios.post(
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

      return this.accessToken;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Failed to get PayPal access token: ${axiosError.message}`);
      throw axiosError;
    }
  }

  /**
    * Creates a new order in PayPal
    */
  async createOrder(product: StoreProductsTypes): Promise<unknown> {

    try {
      const accessToken = await this.getAccessToken()
      const numberPriceToString = product.productPrice.toFixed(2);

      const response = await axios.post(
        `${this.paypalBaseUrl}/v2/checkout/orders`,
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "MXN",
                value: numberPriceToString,
                breakdown: {
                  item_total: {
                    currency_code: "MXN",
                    value: numberPriceToString
                  }
                }
              },
              items: [
                {
                  name: product.productName,
                  quantity: "1",
                  unit_amount: {
                    currency_code: "MXN",
                    value: numberPriceToString
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

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Failed to create PayPal order: ${axiosError.message}`);
      throw axiosError;
    }
  }

  async capturePayment(orderId: string): Promise<unknown> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await axios.post(
        `${this.paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        }
      )

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Failed to capture payment for order: ${axiosError.message}`);
      throw error;
    }
  }

}

export default new PayPalClient()
