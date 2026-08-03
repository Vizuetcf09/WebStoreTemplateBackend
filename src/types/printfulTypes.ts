// Tipos básicos de Printful
export interface PrintfulProduct {
  id: number;
  external_id: string;
  title: string;
  description?: string;
  image: string;
  variants: PrintfulVariant[];
}

export interface PrintfulVariant {
  id: number;
  external_id?: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  retail_price?: number;
}

export interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  sync_variant_id?: number;
}

export interface PrintfulOrder {
  external_id?: string;
  shipping: "STANDARD" | "EXPRESS";
  recipient: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
    email: string;
    phone?: string;
  };
  items: PrintfulOrderItem[];
}

export interface PrintfulApiResponse<T> {
  code: number;
  result: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PrintfulShippingRate {
  id: string;
  name: string;
  rate: number;
  currency: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}