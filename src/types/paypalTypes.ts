export interface PayPalOrder {
  id: string;
  status: 'CREATED' | 'APPROVED' | 'VOIDED' | 'COMPLETED';
  payer?: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  links: Array<{
    rel: string;
    href: string;
  }>;
}

export interface PayPalCapture {
  id: string;
  status: string;
  payer: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
  purchase_units: Array<{
    reference_id: string;
    shipping?: any;
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
}

export interface PayPalErrorResponse {
  name: string;
  details: Array<{
    field: string;
    issue: string;
  }>;
  message: string;
}