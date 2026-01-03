import { z } from 'zod';

// PayPal Total and Unit Amount Schemas

// Mount Value Schema
/**
 * Validador para montos monetarios
 * Acepta strings en formato "123.45" o números
 */
// const MountValueSchema = z.string()
//   .regex(/^\d+(\.\d{1,2})?$/, 'El monto debe ser un número válido con máximo 2 decimales')
//   .refine((val) => parseFloat(val) > 0, 'El monto debe ser mayor a 0');

// Currency Code Schema
/**
 * Código de moneda ISO 4217 (USD, MXN, EUR, etc.)
 */
// const CurrencyCodeSchema = z.string()
//   .length(3, 'El código de moneda debe tener exactamente 3 caracteres')
//   .regex(/^[A-Z]{3}$/, 'El código de moneda debe contener solo letras mayúsculas')
//   .default('USD');

// PayPal Token Schemas

// PayPal Token Response
export const PayPalTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
});
export type PayPalTokenResponseType = z.infer<typeof PayPalTokenResponseSchema>;


// Create Order Schemas

// Quantity Schema

// const QuantitySchema = z
//   .preprocess((val) => {
//     if (typeof val === 'string' || typeof val === 'number') {
//       return Number(val);
//     }
//     return val;
//   }, z.number({ message: 'La cantidad debe ser un número' }).int('La cantidad debe ser un entero').positive('La cantidad debe ser mayor a 0')
//   ).transform((num) => num.toString());

// const PayPalItemsSchema = z.object({
//   name: z.string().min(1, 'El nombre del producto es requerido').max(127, 'El nombre no puede exceder 127 caracteres'),
//   quantity: QuantitySchema,
//   unit_amount: ItemTotalAndUnitAmountSchema,
// });

// PayPal Application Context
// const PayPalApplicationContextSchema = z.object({
//   brand_name: z.string().min(1, 'El nombre de la marca es requerido').max(127, 'El nombre de la marca no puede exceder 127 caracteres'),
//   landing_page: z.enum(['NO_PREFERENCE', 'LOGIN', 'BILLING', 'SIGNUP']).optional(),
//   shipping_preference: z.enum(['GET_FROM_FILE', 'SET_PROVIDED_ADDRESS', 'NO_SHIPPING'], { message: 'shipping_preference debe ser: GET_FROM_FILE, SET_PROVIDED_ADDRESS o NO_SHIPPING' }).default('NO_SHIPPING'),
//   locale: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/, 'El locale debe estar en formato: es-MX, en-US, etc.').optional(),
//   user_action: z.enum(['CONTINUE', 'PAY_NOW'], { message: 'user_action debe ser CONTINUE o PAY_NOW' }).optional(),
//   return_url: z.url({ protocol: /^https$/, message: 'La URL de retorno no es válida' }),
//   cancel_url: z.url({ protocol: /^https$/, message: 'La URL de cancelación no es válida' }),
// }).strict();


// Create Order Schemas

// Create OrderBase Schemas

// Links
export const PayPalLinkSchema = z.object({
  href: z.url({ protocol: /^https$/, message: 'La URL no es válida' }),
  rel: z.string(),
});
export type PayPalLinkType =
  z.infer<typeof PayPalLinkSchema>;

// Create Order Response
export const PayPalCreateOrderResponseSchema = z.object({
  id: z.string().min(1, 'Order ID is required'),
  links: z.array(PayPalLinkSchema),
});
export type PayPalCreateOrderResponseType = z.infer<typeof PayPalCreateOrderResponseSchema>;


// Capture Payment Schemas

// Base Schemas

// Email Address
const EmailSchema = z.email('El correo electrónico no es válido').toLowerCase();

// Payer Name 
const PayPalPayerNameSchema = z.object({
  given_name: z.string(),
  surname: z.string(),
});

// Payer Info
const PayPalPayerInfoSchema = z.object({
  name: PayPalPayerNameSchema,
  email_address: EmailSchema,
  payer_id: z.string(),
});

// Capture Payment Response
export const PayPalCaptureResponseSchema = z.object({
  id: z.string().min(1, 'Capture ID is required'),
  status: z.enum(['COMPLETED', 'DECLINED', 'PENDING', 'FAILED', 'REFUNDED']),
  payer: PayPalPayerInfoSchema,
});

export type PayPalCaptureResponseType = z.infer<typeof PayPalCaptureResponseSchema>;
