// Token reponse
export interface PayPalTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface PayPalTokenResult {
  accessToken: string;
  expiresIn: number;
}

// Create Order and capture payment response links
export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

// Create Order request
export default interface ItemTotalAndUnitAmount {
  currency_code: string;
  value: string;
}

export interface PayPalAmountBreakdown {
  item_total: ItemTotalAndUnitAmount;
}

export interface PayPalAmount {
  currency_code: string;
  value: string;
  breakdown?: PayPalAmountBreakdown;
}

export interface PayPalItems {
  name: string;
  quantity: string;
  unit_amount: ItemTotalAndUnitAmount;
}

export interface PayPalPurchaseUnit {
  amount: PayPalAmount;
  items: PayPalItems[];
}

export interface PayPalApplicationContext {
  brand_name?: string;
  landing_page?: 'NO_PREFERENCE' | 'LOGIN' | 'BILLING' | 'SIGNUP';
  shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
  user_action?: 'CONTINUE' | 'PAY_NOW';
  return_url: string;
  cancel_url: string;
}

export interface PayPalCreateOrderRequest {
  intent: 'CAPTURE';
  purchase_units: PayPalPurchaseUnit[];
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
export interface PayPalPaymentSourcePaypal {
  email_address?: string;
  account_id?: string;
  account_status?: string;
  name: unknown; //TODO: Define name type if needed
  address: unknown; // TODO: Define address type if needed
}

export interface PayPalPaymentSource {
  paypal: PayPalPaymentSourcePaypal;
}

// Capture Payment response | PurchaseUnit
export interface PayPalPurchaseUnit {
  reference_id: 'default';
  shipping: unknown; // TODO: Define shipping type if needed
  payments: unknown; // TODO: Define payments type if needed
}

// Capture Payment response | PayerInfo 
export interface PayPalPayerName {
  given_name: string;
  surname: string;
}

export interface PayPalPayerAddress {
  country_code: string;
}

export interface PayPalPayerInfo {
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
  purchase_units: [PayPalPurchaseUnit];
  payer: PayPalPayerInfo;
  links: PayPalLink[];
}



