import {
  CalculateShippingInput,
  CreateOrderInput,
  PrintfulProductDetailResponse,
  PrintfulSyncProduct,
  PrintfulSyncVariant
} from '../schemas/printfulSchemas.js'; // Ajusta la ruta a tu esquema de Zod

// ==========================================
// API Printful Responses
// ==========================================

export interface PrintfulApiResponse<T> {
  code: number;
  result: T;
  error?: {
    code: string;
    message: string;
  };
}

// Producto obtenido de GET /store/products (lista resumida)
export type PrintfulStoreProduct = PrintfulSyncProduct;

// Detalle completo de GET /store/products/{id}
export type PrintfulProductDetail = PrintfulProductDetailResponse;

// Variante individual de Printful
export type PrintfulVariant = PrintfulSyncVariant;

// ==========================================
// Shipping & Orders
// ==========================================

export interface PrintfulShippingRate {
  id: string;
  name: string;
  rate: string; // Printful lo devuelve como string o number ej: "4.50"
  currency: string;
  minDeliveryDays?: number;
  maxDeliveryDays?: number;
}

export type CalculateShippingPayload = CalculateShippingInput;
export type CreateOrderPayload = CreateOrderInput;

export interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  sync_variant_id?: number;
}