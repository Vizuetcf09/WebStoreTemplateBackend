// PayPal
export interface PayPalTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface PayPalCreateOrderResponse {
  id: string;
  status: 'CREATED' | 'APPROVED' | 'VOIDED' | 'COMPLETED';
  links: Array<{
    href: string;
    rel: 'self' | 'approve' | 'update' | 'capture';
    method: string;
  }>;
}

export interface PayPalCreateOrderResult {
  orderID: string;
  approveLink: string;
}

export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PENDING';
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

