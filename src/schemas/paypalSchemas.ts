import { z } from 'zod';

// Base Schemas

// PayPal Order and Capture Payment links Schemas

// Create Order and capture payment response links
export const PayPalLinkSchema = z.object({
  href: z.url({ protocol: /^https$/, message: 'La URL no es válida' }),
  rel: z.string(),
  method: z.string(),
});

export type PayPalLink = z.infer<typeof PayPalLinkSchema>;

// PayPal Total and Unit Amount Schemas

// Mount Value Schema
/**
 * Validador para montos monetarios
 * Acepta strings en formato "123.45" o números
 */
const MountValueSchema = z.string()
  .regex(/^\d+(\.\d{1,2})?$/, 'El monto debe ser un número válido con máximo 2 decimales')
  .refine((val) => parseFloat(val) > 0, 'El monto debe ser mayor a 0');

// Currency Code Schema
/**
 * Código de moneda ISO 4217 (USD, MXN, EUR, etc.)
 */
const CurrencyCodeSchema = z.string()
  .length(3, 'El código de moneda debe tener exactamente 3 caracteres')
  .regex(/^[A-Z]{3}$/, 'El código de moneda debe contener solo letras mayúsculas')
  .default('USD');

// Item total and unit amount
export const ItemTotalAndUnitAmountSchema = z.object({
  currency_code: CurrencyCodeSchema,
  value: MountValueSchema,
});

// PayPal Token Response Schema

// PayPal Token response
export const PayPalTokenResponseSchema = z.object({
  scope: z.string(),
  access_token: z.string(),
  token_type: z.string(),
  app_id: z.string(),
  expires_in: z.number(),
});

export type PayPalTokenResponse = z.infer<typeof PayPalTokenResponseSchema>;

// PayPal Token result
export const PayPalTokenResultSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
}).strict();

export type PayPalTokenResult = z.infer<typeof PayPalTokenResultSchema>;

// Create Order Schemas

// PayPal amount breakdown
const PayPalAmountBreakdownSchema = z.object({
  item_total: ItemTotalAndUnitAmountSchema,
});

// PayPal Purchase Unit | Amount and Items
const PayPalAmountSchema = z.object({
  currency_code: CurrencyCodeSchema,
  value: MountValueSchema,
  breakdown: PayPalAmountBreakdownSchema.optional(),
});

// Quantity Schema
const QuantitySchema = z
  .preprocess((val) => {
    if (typeof val === 'string' || typeof val === 'number') {
      return Number(val);
    }
    return val;
  }, z.number({ message: 'La cantidad debe ser un número' }).int('La cantidad debe ser un entero').positive('La cantidad debe ser mayor a 0')
  ).transform((num) => num.toString());


const PayPalItemsSchema = z.object({
  name: z.string().min(1, 'El nombre del producto es requerido').max(127, 'El nombre no puede exceder 127 caracteres'),
  quantity: QuantitySchema,
  unit_amount: ItemTotalAndUnitAmountSchema,
});

const PayPalPurchaseUnitSchema = z.object({
  amount: PayPalAmountSchema,
  items: z.array(PayPalItemsSchema),
});

// PayPal Application Context
const PayPalApplicationContextSchema = z.object({
  brand_name: z.string().min(1, 'El nombre de la marca es requerido').max(127, 'El nombre de la marca no puede exceder 127 caracteres'),
  landing_page: z.enum(['NO_PREFERENCE', 'LOGIN', 'BILLING', 'SIGNUP']).optional(),
  shipping_preference: z.enum(['GET_FROM_FILE', 'SET_PROVIDED_ADDRESS', 'NO_SHIPPING'], { message: 'shipping_preference debe ser: GET_FROM_FILE, SET_PROVIDED_ADDRESS o NO_SHIPPING' }).default('NO_SHIPPING'),
  locale: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/, 'El locale debe estar en formato: es-MX, en-US, etc.').optional(),
  user_action: z.enum(['CONTINUE', 'PAY_NOW'], { message: 'user_action debe ser CONTINUE o PAY_NOW' }).optional(),
  return_url: z.url({ protocol: /^https$/, message: 'La URL de retorno no es válida' }),
  cancel_url: z.url({ protocol: /^https$/, message: 'La URL de cancelación no es válida' }),
}).strict();

// Create Order request
export const PayPalCreateOrderRequestSchema = z.object({
  intent: z.enum(['CAPTURE', 'AUTHORIZE'], { message: 'intent debe ser CAPTURE o AUTHORIZE' }).default('CAPTURE'),
  purchase_units: z.array(PayPalPurchaseUnitSchema),
  application_context: PayPalApplicationContextSchema.optional(),
});

export type PayPalCreateOrderRequest = z.infer<typeof PayPalCreateOrderRequestSchema>;

// Create Order response

export const PayPalCreateOrderResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  links: z.array(PayPalLinkSchema),
}).strict();

export type PayPalCreateOrderResponse = z.infer<typeof PayPalCreateOrderResponseSchema>;

export const PayPalCreateOrderResultSchema = z.object({
  orderID: z.string(),
  approveLink: z.string().url(),
}).strict();

export type PayPalCreateOrderResult = z.infer<typeof PayPalCreateOrderResultSchema>;

// Capture Payment response

// Capture Payment response | PaymentSource
const PayPalPaymentSourcePaypalSchema = z.object({
  email_address: z.string().email().optional(),
  account_id: z.string().optional(),
  account_status: z.enum(['VERIFIED', 'UNVERIFIED']).optional(),
  name: z.unknown(), //TODO: Define name type if needed
  address: z.unknown(), // TODO: Define address type if needed
}).strict();

const PayPalPaymentSourceSchema = z.object({
  paypal: PayPalPaymentSourcePaypalSchema,
}).strict();

// Capture Payment response | PurchaseUnit
const PayPalPurchaseUnitResponseSchema = z.object({
  reference_id: z.string(),
  shipping: z.unknown(), // TODO: Define shipping type if needed
  payments: z.unknown(), // TODO: Define payments type if needed
}).strict();

// Capture Payment response | PayerInfo 
const PayPalPayerNameSchema = z.object({
  given_name: z.string(),
  surname: z.string(),
}).strict();

/**
 * Código de país ISO 3166-1 alpha-2 (US, MX, ES, etc.)
 */
const CountryCodeSchema = z.string()
  .length(2, 'El código de país debe tener exactamente 2 caracteres')
  .regex(/^[A-Z]{2}$/, 'El código de país debe contener solo letras mayúsculas');

const PayPalPayerAddressSchema = z.object({
  country_code: CountryCodeSchema,
}).strict();

/**
 * Email válido
 */
const EmailSchema = z.email('El correo electrónico no es válido')
  .toLowerCase();

const PayPalPayerInfoSchema = z.object({
  name: PayPalPayerNameSchema,
  email_address: EmailSchema,
  payer_id: z.string(),
  address: PayPalPayerAddressSchema,
}).strict();

// Capture Payment response
export const PayPalCaptureResponseSchema = z.object({
  id: z.string(),
  status: z.enum(['COMPLETED', 'DECLINED', 'PENDING']),
  payment_source: PayPalPaymentSourceSchema,
  purchase_units: z.array(PayPalPurchaseUnitResponseSchema).length(1),
  payer: PayPalPayerInfoSchema,
  links: z.array(PayPalLinkSchema),
}).strict();

export type PayPalCaptureResponse = z.infer<typeof PayPalCaptureResponseSchema>;
