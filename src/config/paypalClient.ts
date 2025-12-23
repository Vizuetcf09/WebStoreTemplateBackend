interface PayPalTokenResponse {
  access_token: string;
  expires_in: number;
}

class PayPalClient {
  private baseUrl = process.env.PAYPAL_BASE_URL;
  private paypalTokenResponse: PayPalTokenResponse | null = null;

  private logger = {
    error: (message: string, error: unknown) => {
      console.error(`Error [PayPal Client]: ${message}`, error);
    },
    info: (message: string) => {
      console.log(`Info [PayPal Client]: ${message}`);
    },
    success: (message: string) => {
      console.log(`Success [PayPal Client]: ${message}`);
    }
  };

  constructor() {
    if (!this.baseUrl) {
      throw new Error("PAYPAL_BASE_URL is not defined.");
    }
    console.log(`\n🔌 PayPal Client initialized`);
    console.log(`📍 Base URL: ${this.baseUrl}`);
    this.logger.success("Connected to PayPal.");
  }

  async getAccesToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

    if (!clientId || !clientSecret) {
      throw new Error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is not defined.");
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    console.log(`\n🔐 Requesting PayPal Access Token`);
    console.log(`📊 Environment: ${environment}`);
    console.log(`🔑 Client ID: ${clientId.substring(0, 10)}...`);
    console.log(`🔑 Auth Header: Basic ${auth.substring(0, 20)}...`);

    this.logger.info(`Getting PayPal access token for environment: ${environment}`);

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials"
    })

    console.log(`📡 Token Request Status: ${response.status} ${response.statusText}`);


    if (!response.ok) {
      const error = await response.text();
      console.log(`❌ Token Error Response:`, error);
      this.logger.error("Failed to get PayPal access token", error);
      throw new Error(`Paypal token error: ${error}`);
    }

    const data = await response.json();

    console.log(`\n✅ Token Response Received:`);
    console.log(`   - Access Token: ${data.access_token.substring(0, 30)}...`);
    console.log(`   - Token Type: ${data.token_type}`);
    console.log(`   - Expires In: ${data.expires_in} seconds`);
    console.log(`   - App ID: ${data.app_id}`);

    this.paypalTokenResponse = {
      access_token: data.access_token,
      expires_in: Date.now() + (data.expires_in * 1000) - 60000 // Subtract 1 minute to ensure token validity
    }

    this.logger.success("New PayPal access token obtained successfully");

    console.log(data.access_token)
    return data.access_token
  }

  async request<T>(endpoint: string, options: RequestInit = {}
  ): Promise<T> {
    console.log(`\n📤 PayPal API Request`);
    console.log(`   - Method: ${options.method || 'GET'}`);
    console.log(`   - Endpoint: ${endpoint}`);
    console.log(`   - Full URL: ${this.baseUrl}${endpoint}`);

    if (options.body) {
      console.log(`   - Request Body:`, JSON.parse(options.body as string));
    }

    const token = await this.getAccesToken();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    console.log(`\n📥 PayPal API Response`);
    console.log(`   - Status: ${response.status} ${response.statusText}`);
    console.log(`   - Headers:`, {
      'Content-Type': response.headers.get('Content-Type'),
      'Content-Length': response.headers.get('Content-Length'),
      'Date': response.headers.get('Date')
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`   ❌ Error Body:`, error);
      this.logger.error(`PayPal API request to ${endpoint} failed`, error);
      throw new Error(`PAyPal API error: ${error}`)
    }


    const data = await response.json();

    console.log(`   ✅ Response Body:`, JSON.stringify(data, null, 2));

    return data as Promise<T>;
  }

}

export default new PayPalClient;