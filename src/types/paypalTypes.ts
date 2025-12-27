// Base Types

// PayPal Order and Capture Payment links Types

// Create Order and capture payment response links
interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

// PayPal Total and Unit Amount Types

// Item total and unit amount
interface ItemTotalAndUnitAmount {
  currency_code: string;
  value: string;
}

// PayPal Token Types

// PayPal Token response
export interface PayPalTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

// PayPal Token result
export interface PayPalTokenResult {
  accessToken: string;
  expiresIn: number;
}

// Create Order Types

// PayPal amount breakdown
interface PayPalAmountBreakdown {
  item_total: ItemTotalAndUnitAmount;
}

// PayPal Purchase Unit | Amount and Items
interface PayPalAmount {
  currency_code: string;
  value: string;
  breakdown?: PayPalAmountBreakdown;
}

interface PayPalItems {
  name: string;
  quantity: string;
  unit_amount: ItemTotalAndUnitAmount;
}

export interface PayPalPurchaseUnitCreateOrder {
  amount: PayPalAmount;
  items: PayPalItems[];
}

// PayPal Application Context
interface PayPalApplicationContext {
  brand_name?: string;
  landing_page?: 'NO_PREFERENCE' | 'LOGIN' | 'BILLING' | 'SIGNUP';
  shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
  user_action?: 'CONTINUE' | 'PAY_NOW';
  return_url: string;
  cancel_url: string;
}

// Create Order request
export interface PayPalCreateOrderRequest {
  intent: 'CAPTURE';
  purchase_units: PayPalPurchaseUnitCreateOrder[];
  application_context: PayPalApplicationContext;
}

// Create Order response

export interface PayPalCreateOrderResponse {
  id: string;
  status: string;
  links: PayPalLink[];
}

export interface PayPalCreateOrderResult {
  orderID: string;
  approveLink: string;
}

// Capture Payment response

// Capture Payment response | PaymentSource
interface PayPalPaymentSourcePaypal {
  email_address?: string;
  account_id?: string;
  account_status?: string;
  name: unknown; //TODO: Define name type if needed
  address: unknown; // TODO: Define address type if needed
}

interface PayPalPaymentSource {
  paypal: PayPalPaymentSourcePaypal;
}

// Capture Payment response | PurchaseUnit
interface PayPalPurchaseUnitPaymentCapture {
  reference_id: 'default';
  shipping: unknown; // TODO: Define shipping type if needed
  payments: unknown; // TODO: Define payments type if needed
}

// Capture Payment response | PayerInfo 
interface PayPalPayerName {
  given_name: string;
  surname: string;
}

interface PayPalPayerAddress {
  country_code: string;
}

interface PayPalPayerInfo {
  name: PayPalPayerName;
  email_address: string;
  payer_id: string;
  address: PayPalPayerAddress
}

// Capture Payment response
export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PENDING';
  payment_source: PayPalPaymentSource;
  purchase_units: [PayPalPurchaseUnitPaymentCapture];
  payer: PayPalPayerInfo;
  links: PayPalLink[];
}
