import axios from "axios"

class PayPalClient {

  private paypalBaseUrl = process.env.PAYPAL_BASE_URL
  private baseUrl = process.env.BASE_URL

  async getAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret || !this.paypalBaseUrl) {
      throw new Error("PayPal environment variables are not configured")
    }

    const response = await axios.post(
      `${this.paypalBaseUrl}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: {
          username: clientId,
          password: clientSecret
        },
      }
    )

    console.log(response.data.access_token)
    return response.data.access_token
  }

  async createOrder() {
    const accessToken = await this.getAccessToken()

    const response = await axios.post(
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
                name: "Product",
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
          return_url: `${this.baseUrl}/complete-order`,
          cancel_url: `${this.baseUrl}/cancel-order`,
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "Web Page"
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      },
    )

    console.log(response.data.links.find(link => link.rel === 'approve').href)
    return response.data.links.find(link => link.rel === 'approve').href
  }

}

export default new PayPalClient()
