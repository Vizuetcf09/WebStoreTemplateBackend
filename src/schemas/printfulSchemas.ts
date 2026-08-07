import { z } from 'zod';

// Subesquema reutilizable para dirección/destinatario
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

// Schema para cálculo de envío
export const calculateShippingSchema = z.object({
  to: recipientSchema,
  items: z.array(
    z.object({
      variant_id: z.number().min(1),
      quantity: z.number().min(1)
    })
  )
});

// Schema para creación de orden
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
export type CalculateShippingInput = z.infer<typeof calculateShippingSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;