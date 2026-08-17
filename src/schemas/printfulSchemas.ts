import { z } from 'zod';

// ==========================================
// Printful Sync Product / Variant Schemas
// ==========================================

export const printfulSyncVariantSchema = z.object({
  id: z.number(), // variant_id que pide Printful para shipping/orders
  external_id: z.string().nullish(),
  sync_product_id: z.number().optional(),
  name: z.string(),
  synced: z.boolean().optional(),
  variant_id: z.number().optional(),
  retail_price: z.string().or(z.number()),
  currency: z.string().optional(),
  is_ignored: z.boolean().default(false),
  sku: z.string().nullish(),
  product: z.object({
    variant_id: z.number().optional(),
    product_id: z.number().optional(),
    image: z.string().optional(),
    name: z.string().optional()
  }).optional()
});

export const printfulSyncProductSchema = z.object({
  id: z.number(),
  external_id: z.string().nullish(),
  name: z.string(),
  variants: z.number().optional(),
  synced: z.number().optional(),
  thumbnail_url: z.string(),
  is_ignored: z.boolean().default(false)
});

// Respuesta completa del endpoint GET /store/products/{id}
export const printfulProductDetailResponseSchema = z.object({
  sync_product: printfulSyncProductSchema,
  sync_variants: z.array(printfulSyncVariantSchema)
});

// ==========================================
// Ordenes y Envíos (Existentes)
// ==========================================

export const recipientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  address1: z.string().min(1, 'La dirección es requerida'),
  address2: z.string().optional(),
  city: z.string().min(1, 'La ciudad es requerida'),
  state_code: z.string().min(2, 'El código de estado es requerido'),
  country_code: z.string().length(2, 'El código de país debe ser 2 caracteres'),
  zip: z.string().min(1, 'El código postal es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional()
});

export const calculateShippingSchema = z.object({
  to: recipientSchema,
  items: z.array(
    z.object({
      variant_id: z.number().min(1),
      quantity: z.number().min(1)
    })
  )
});

export const createOrderSchema = z.object({
  external_id: z.string().optional(),
  shipping: z.enum(['STANDARD', 'EXPRESS']),
  recipient: recipientSchema,
  items: z.array(
    z.object({
      variant_id: z.number().min(1),
      quantity: z.number().min(1),
      sync_variant_id: z.number().optional()
    })
  )
});

// Tipos inferidos
export type PrintfulSyncVariant = z.infer<typeof printfulSyncVariantSchema>;
export type PrintfulSyncProduct = z.infer<typeof printfulSyncProductSchema>;
export type PrintfulProductDetailResponse = z.infer<typeof printfulProductDetailResponseSchema>;
export type CalculateShippingInput = z.infer<typeof calculateShippingSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;