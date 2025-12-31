// Base Types

// PayPal Order and Capture Payment links Types

// Create Order and capture payment response links
interface PayPalLinkType {
  href: string;
  rel: string;
  method: string;
}

// PayPal Total and Unit Amount Types

// Item total and unit amount
interface ItemTotalAndUnitAmountType {
  currency_code: string;
  value: string;
}

// PayPal Token Types

// PayPal Token response
export interface PayPalTokenResponseType {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

// PayPal Token result
export interface PayPalTokenResultType {
  accessToken: string;
  expiresIn: number;
}

// Create Order Types

// PayPal amount breakdown
interface PayPalAmountBreakdownType {
  item_total: ItemTotalAndUnitAmountType;
}

// PayPal Purchase Unit | Amount and Items
interface PayPalAmountType {
  currency_code: string;
  value: string;
  breakdown?: PayPalAmountBreakdownType;
}

interface PayPalItemsType {
  name: string;
  quantity: string;
  unit_amount: ItemTotalAndUnitAmountType;
}

export interface PayPalPurchaseUnitCreateOrderType {
  amount: PayPalAmountType;
  items: PayPalItemsType[];
}

// PayPal Application Context
interface PayPalApplicationContextType {
  brand_name: string;
  landing_page?: 'NO_PREFERENCE' | 'LOGIN' | 'BILLING' | 'SIGNUP';
  shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
  user_action?: 'CONTINUE' | 'PAY_NOW';
  return_url: string;
  cancel_url: string;
}

// Create Order request
export interface PayPalCreateOrderRequestType {
  intent: 'CAPTURE';
  purchase_units: PayPalPurchaseUnitCreateOrderType[];
  application_context: PayPalApplicationContextType;
}

// Create Order response

export interface PayPalCreateOrderResponseType {
  id: string;
  status: string;
  links: PayPalLinkType[];
}

export interface PayPalCreateOrderResultType {
  orderID: string;
  approveLink: string;
}

// Capture Payment response

// Capture Payment response | PaymentSource
interface PayPalPaymentSourcePaypalType {
  email_address?:  string;
  account_id?: string;
  account_status?: string;
  name?: unknown; //TODO: Define name type if needed
  address?: unknown; // TODO: Define address type if needed
}

interface PayPalPaymentSourceType {
  paypal: PayPalPaymentSourcePaypalType;
}

// Capture Payment response | PurchaseUnit
interface PayPalPurchaseUnitPaymentCaptureType {
  reference_id: 'default';
  shipping: unknown; // TODO: Define shipping type if needed
  payments: unknown; // TODO: Define payments type if needed
}

// Capture Payment response | PayerInfo 
interface PayPalPayerNameType {
  given_name: string;
  surname: string;
}

interface PayPalPayerAddressType {
  country_code: string;
}

interface PayPalPayerInfoType {
  name: PayPalPayerNameType;
  email_address: string;
  payer_id: string;
  address: PayPalPayerAddressType;
}

// Capture Payment response
export interface PayPalCaptureResponseType {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PENDING';
  payment_source: PayPalPaymentSourceType;
  purchase_units: [PayPalPurchaseUnitPaymentCaptureType];
  payer: PayPalPayerInfoType;
  links: PayPalLinkType[];
}
