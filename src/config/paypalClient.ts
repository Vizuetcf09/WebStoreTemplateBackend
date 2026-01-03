import axios, { AxiosError } from "axios"

class PayPalClient {

  private paypalBaseUrl = process.env.PAYPAL_BASE_URL || '';
  private paypalApiBaseUrl = process.env.PAYPAL_API_BASE_URL || '';
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

    if (!this.clientId || !this.clientSecret || !this.paypalBaseUrl) {
      throw new Error('PayPal environment variables are not configured: PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET')
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
  async createOrder(): Promise<unknown> {

    try {
      const accessToken = await this.getAccessToken()

      const response = await axios.post(
        `${this.paypalBaseUrl}/v2/checkout/orders`,
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "MXN",
                value: "10.00",
                breakdown: {
                  item_total: {
                    currency_code: "MXN",
                    value: "10.00"
                  }
                }
              },
              items: [
                {
                  name: "Laptop",
                  quantity: "1",
                  unit_amount: {
                    currency_code: "MXN",
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

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Failed to create PayPal order: ${axiosError.message}`);
      throw axiosError;
    }
  }

  async capturePayment(orderID: string): Promise<unknown> {
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

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Failed to capture payment for order: ${axiosError.message}`);
      throw error;
    }
  }

}

export default new PayPalClient()
