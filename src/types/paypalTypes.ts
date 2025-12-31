// PayPal Token Types

// PayPal Token Response
export interface PayPalTokenResponseType {
  access_token: string;
  expires_in: number;
}

// PayPal Token Result
export interface PayPalTokenResultType {
  accessToken: string;
  expiresIn: number;
}

// Create Order Types

// Create Order Base Types

// // PayPal Application Context
// interface PayPalApplicationContextType {
//   brand_name: string;
//   landing_page?: 'NO_PREFERENCE' | 'LOGIN' | 'BILLING' | 'SIGNUP';
//   shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
//   user_action?: 'CONTINUE' | 'PAY_NOW';
//   return_url: string;
//   cancel_url: string;
// }

// Links
interface PayPalLinkType {
  href: string;
  rel: string;
}

// Create Order Response
export interface PayPalCreateOrderResponseType {
  id: string;
  links: PayPalLinkType[];
}


// Capture Payment Types

// Capture Payment Base Types

// Payer Name 
interface PayPalPayerNameType {
  given_name: string;
  surname: string;
}

// Payer Info
interface PayPalPayerInfoType {
  name: PayPalPayerNameType;
  email_address: string;
  payer_id: string;
}

// Capture Payment Response
export interface PayPalCaptureResponseType {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PENDING';
  payer: PayPalPayerInfoType;
}
