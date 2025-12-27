import { z } from 'zod';

// PayPal Token Response Schema

// PayPal Token response
export const PayPalTokenResponseSchema = z.object({
    scope: z.string(),
    access_token: z.string(),
    token_type: z.string(),
    app_id: z.string(),
    expires_in: z.number(),
}).strict();

export type PayPalTokenResponse = z.infer<typeof PayPalTokenResponseSchema>;

// PayPal Token result
export const PayPalTokenResultSchema = z.object({
    accessToken: z.string(),
    expiresIn: z.number(),
}).strict();

export type PayPalTokenResult = z.infer<typeof PayPalTokenResultSchema>;

// PayPal Order and Capture Payment links Schemas

// Create Order and capture payment response links
export const PayPalLinkSchema = z.object({
    href: z.string(),
    rel: z.string(),
    method: z.string(),
}).strict();

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

// Create Order Schemas

// Create Order request
export const PayPalCreateOrderRequestSchema = z.object({
    intent: z.enum(['CAPTURE', 'AUTHORIZE'], { message: 'intent debe ser CAPTURE o AUTHORIZE' })
        .default('CAPTURE'),

    purchase_units: z.array(z.object({
        amount: z.object({
            currency_code: CurrencyCodeSchema,
            value: MoneySchema,
            breakdown: PayPalAmountBreakdownSchema.optional(),
        }),
        items: z.array(PayPalItemSchema),
    })),

    application_context: z.object({
        brand_name: z.string().max(127, 'El nombre de la marca no puede exceder 127 caracteres').optional(),
        landing_page: z.enum(['NO_PREFERENCE', 'LOGIN', 'BILLING', 'SIGNUP']).optional(),
        shipping_preference: z.enum(['GET_FROM_FILE', 'NO_SHIPPING', 'SET_PROVIDED_ADDRESS']).optional(),
        user_action: z.enum(['CONTINUE', 'PAY_NOW']).optional(),
        return_url: URLSchema,
        cancel_url: URLSchema,
    }),
}).strict();

export type PayPalCreateOrderRequest = z.infer<typeof PayPalCreateOrderRequestSchema>;

// ============================================
// VALIDACIONES BÁSICAS
// ============================================

/**
 * Código de país ISO 3166-1 alpha-2 (US, MX, ES, etc.)
 */
const CountryCodeSchema = z.string()
    .length(2, 'El código de país debe tener exactamente 2 caracteres')
    .regex(/^[A-Z]{2}$/, 'El código de país debe contener solo letras mayúsculas');

/**
 * Email válido
 */
const EmailSchema = z.string()
    .email('El email no es válido')
    .toLowerCase();

/**
 * URL válida
 */
const URLSchema = z.string()
    .url('La URL no es válida');

// ============================================
// ESQUEMAS PARA ITEMS
// ============================================

export const PayPalItemSchema = z.object({
    name: z.string()
        .min(1, 'El nombre del producto es requerido')
        .max(127, 'El nombre no puede exceder 127 caracteres'),

    quantity: z.union([z.string(), z.number()])
        .transform((val) => {
            const num = typeof val === 'string' ? parseInt(val, 10) : val;
            if (isNaN(num)) throw new Error('La cantidad debe ser un número válido');
            return num.toString();
        })
        .refine((val) => parseInt(val, 10) > 0, 'La cantidad debe ser mayor a 0'),

    unit_amount: z.object({
        currency_code: CurrencyCodeSchema,
        value: MoneySchema,
    }),

    description: z.string()
        .max(127, 'La descripción no puede exceder 127 caracteres')
        .optional(),

    sku: z.string()
        .max(127, 'El SKU no puede exceder 127 caracteres')
        .optional(),
});

export type PayPalItem = z.infer<typeof PayPalItemSchema>;

// ============================================
// ESQUEMAS PARA MONTOS
// ============================================

const AmountWithCurrencySchema = z.object({
    currency_code: CurrencyCodeSchema,
    value: MoneySchema,
});

export const PayPalAmountBreakdownSchema = z.object({
    item_total: AmountWithCurrencySchema,

    tax_total: AmountWithCurrencySchema
        .optional(),

    shipping: AmountWithCurrencySchema
        .optional(),

    handling: AmountWithCurrencySchema
        .optional(),

    discount: AmountWithCurrencySchema
        .optional(),
}).strict();

export type PayPalAmountBreakdown = z.infer<typeof PayPalAmountBreakdownSchema>;

// ============================================
// ESQUEMAS PARA DIRECCIÓN
// ============================================

export const PayPalAddressSchema = z.object({
    address_line_1: z.string()
        .min(1, 'La dirección es requerida')
        .max(300, 'La dirección no puede exceder 300 caracteres'),

    address_line_2: z.string()
        .max(300, 'La dirección 2 no puede exceder 300 caracteres')
        .optional(),

    admin_area_1: z.string()
        .min(1, 'El estado/provincia es requerido')
        .max(120, 'El estado/provincia no puede exceder 120 caracteres'),

    admin_area_2: z.string()
        .min(1, 'La ciudad es requerida')
        .max(120, 'La ciudad no puede exceder 120 caracteres'),

    postal_code: z.string()
        .min(1, 'El código postal es requerido')
        .max(60, 'El código postal no puede exceder 60 caracteres'),

    country_code: CountryCodeSchema,
}).strict();

export type PayPalAddress = z.infer<typeof PayPalAddressSchema>;

// ============================================
// ESQUEMAS PARA UNIDAD DE COMPRA
// ============================================

export const PayPalPurchaseUnitSchema = z.object({
    reference_id: z.string()
        .max(256, 'El reference_id no puede exceder 256 caracteres')
        .optional(),

    description: z.string()
        .max(127, 'La descripción no puede exceder 127 caracteres')
        .optional(),

    amount: z.object({
        currency_code: CurrencyCodeSchema,
        value: MoneySchema,
        breakdown: PayPalAmountBreakdownSchema.optional(),
    }),

    items: z.array(PayPalItemSchema)
        .min(1, 'Se requiere al menos 1 producto'),

    shipping_address: PayPalAddressSchema.optional(),

    custom_id: z.string()
        .max(127, 'El custom_id no puede exceder 127 caracteres')
        .optional(),

    invoice_id: z.string()
        .max(127, 'El invoice_id no puede exceder 127 caracteres')
        .optional(),
}).strict();

export type PayPalPurchaseUnit = z.infer<typeof PayPalPurchaseUnitSchema>;

// ============================================
// ESQUEMAS PARA CONTEXTO DE APLICACIÓN
// ============================================

export const PayPalApplicationContextSchema = z.object({
    return_url: URLSchema,

    cancel_url: URLSchema,

    shipping_preference: z.enum(
        ['GET_FROM_FILE', 'SET_PROVIDED_ADDRESS', 'NO_SHIPPING'],
        { message: 'shipping_preference debe ser: GET_FROM_FILE, SET_PROVIDED_ADDRESS o NO_SHIPPING' }
    ).default('NO_SHIPPING'),

    user_action: z.enum(['CONTINUE', 'PAY_NOW'], { message: 'user_action debe ser CONTINUE o PAY_NOW' })
        .default('PAY_NOW'),

    brand_name: z.string()
        .min(1, 'El nombre de la marca es requerido')
        .max(127, 'El nombre de la marca no puede exceder 127 caracteres'),

    locale: z.string()
        .regex(/^[a-z]{2}-[A-Z]{2}$/, 'El locale debe estar en formato: es-MX, en-US, etc.')
        .optional(),
}).strict();

export type PayPalApplicationContext = z.infer<typeof PayPalApplicationContextSchema>;

// ============================================
// ESQUEMAS PARA CREAR ORDEN
// ============================================

export const PayPalCreateOrderRequestSchema = z.object({
    intent: z.enum(['CAPTURE', 'AUTHORIZE'], { message: 'intent debe ser CAPTURE o AUTHORIZE' })
        .default('CAPTURE'),

    payer: z.object({
        name: z.object({
            given_name: z.string()
                .max(140, 'El nombre no puede exceder 140 caracteres')
                .optional(),
            surname: z.string()
                .max(140, 'El apellido no puede exceder 140 caracteres')
                .optional(),
        }).optional(),

        email_address: EmailSchema.optional(),
    }).optional(),

    purchase_units: z.array(PayPalPurchaseUnitSchema)
        .min(1, 'Se requiere al menos una unidad de compra'),

    application_context: PayPalApplicationContextSchema.optional(),
}).strict();

export type PayPalCreateOrderRequest = z.infer<typeof PayPalCreateOrderRequestSchema>;

// ============================================
// ESQUEMAS PARA FRONTEND (DTOs)
// ============================================

/**
 * Schema para el payload que envía el frontend
 */
export const CreateOrderPayloadSchema = z.object({
    items: z.array(
        z.object({
            name: z.string()
                .min(1, 'El nombre del producto es requerido')
                .max(127, 'El nombre no puede exceder 127 caracteres'),

            quantity: z.number()
                .int('La cantidad debe ser un número entero')
                .positive('La cantidad debe ser mayor a 0'),

            unit_amount: z.string()
                .regex(/^\d+(\.\d{1,2})?$/, 'El precio debe tener máximo 2 decimales'),

            description: z.string()
                .max(127, 'La descripción no puede exceder 127 caracteres')
                .optional(),
        })
    ).min(1, 'Se requiere al menos 1 producto'),

    total_amount: z.string()
        .regex(/^\d+(\.\d{1,2})?$/, 'El monto total debe tener máximo 2 decimales'),

    currency_code: CurrencyCodeSchema.optional(),

    return_url: URLSchema,

    cancel_url: URLSchema,
}).strict();

export type CreateOrderPayload = z.infer<typeof CreateOrderPayloadSchema>;

// ============================================
// ESQUEMAS PARA CAPTURA DE PAGO
// ============================================

export const CapturePaymentSchema = z.object({
    orderID: z.string()
        .min(1, 'El ID de la orden es requerido')
        .max(36, 'El ID de la orden no puede exceder 36 caracteres'),
}).strict();

export type CapturePaymentInput = z.infer<typeof CapturePaymentSchema>;

// ============================================
// ESQUEMAS PARA RESPUESTAS DE PAYPAL
// ============================================

export const PayPalPayerNameSchema = z.object({
    given_name: z.string().optional(),
    surname: z.string().optional(),
}).strict();

export const PayPalPayerAddressSchema = z.object({
    country_code: CountryCodeSchema,
    state: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
}).strict();

export const PayPalPayerInfoSchema = z.object({
    name: PayPalPayerNameSchema,
    email_address: EmailSchema.optional(),
    payer_id: z.string(),
    address: PayPalPayerAddressSchema.optional(),
}).strict();

export type PayPalPayerInfo = z.infer<typeof PayPalPayerInfoSchema>;

export const PayPalPaymentSourceSchema = z.object({
    paypal: z.object({
        email_address: EmailSchema.optional(),
        account_id: z.string(),
        account_status: z.enum(['VERIFIED', 'UNVERIFIED']).optional(),
        name: PayPalPayerNameSchema.optional(),
        address: PayPalPayerAddressSchema.optional(),
    }).strict(),
}).strict();

export type PayPalPaymentSource = z.infer<typeof PayPalPaymentSourceSchema>;

export const PayPalCaptureDetailsSchema = z.object({
    id: z.string(),
    status: z.string(),
    amount: z.object({
        currency_code: CurrencyCodeSchema,
        value: MoneySchema,
    }),
    create_time: z.string().datetime().optional(),
    update_time: z.string().datetime().optional(),
}).strict();

export const PayPalPaymentsSchema = z.object({
    captures: z.array(PayPalCaptureDetailsSchema).optional(),
    authorizations: z.array(
        z.object({
            id: z.string(),
            status: z.string(),
            amount: z.object({
                currency_code: CurrencyCodeSchema,
                value: MoneySchema,
            }),
        }).strict()
    ).optional(),
    refunds: z.array(
        z.object({
            id: z.string(),
            status: z.string(),
            amount: z.object({
                currency_code: CurrencyCodeSchema,
                value: MoneySchema,
            }),
        }).strict()
    ).optional(),
}).strict();

export const PayPalPurchaseUnitResponseSchema = z.object({
    reference_id: z.string(),
    shipping: z.object({
        name: PayPalPayerNameSchema.optional(),
        address: PayPalPayerAddressSchema.optional(),
    }).optional(),
    payments: PayPalPaymentsSchema.optional(),
    amount: z.object({
        currency_code: CurrencyCodeSchema,
        value: MoneySchema,
    }).optional(),
}).strict();

export type PayPalPurchaseUnitResponse = z.infer<typeof PayPalPurchaseUnitResponseSchema>;

export const PayPalCaptureResponseSchema = z.object({
    id: z.string(),
    status: z.enum(['COMPLETED', 'DECLINED', 'PROCESSING', 'PENDING']),
    payment_source: PayPalPaymentSourceSchema.optional(),
    purchase_units: z.array(PayPalPurchaseUnitResponseSchema),
    payer: PayPalPayerInfoSchema.optional(),
    links: z.array(
        z.object({
            href: z.string(),
            rel: z.string(),
            method: z.string().optional(),
        }).strict()
    ),
}).strict();

export type PayPalCaptureResponse = z.infer<typeof PayPalCaptureResponseSchema>;

// ============================================
// ESQUEMAS PARA ERRORES
// ============================================

export const PayPalErrorDetailSchema = z.object({
    field: z.string(),
    issue: z.string(),
    value: z.string().optional(),
}).strict();

export const PayPalErrorResponseSchema = z.object({
    name: z.string(),
    message: z.string(),
    details: z.array(PayPalErrorDetailSchema).optional(),
    links: z.array(
        z.object({
            href: z.string(),
            rel: z.string(),
            method: z.string().optional(),
        }).strict()
    ).optional(),
}).strict();

export type PayPalErrorResponse = z.infer<typeof PayPalErrorResponseSchema>;

// ============================================
// RESPUESTAS PARA FRONTEND
// ============================================

export const CreateOrderResponseSchema = z.object({
    success: z.boolean(),
    orderId: z.string(),
    approvalUrl: z.string().url(),
}).strict();

export type CreateOrderResponse = z.infer<typeof CreateOrderResponseSchema>;

export const CaptureOrderResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    orderId: z.string(),
    payer: PayPalPayerInfoSchema.optional(),
    paymentDetails: z.object({
        amount: z.string(),
        currency: z.string(),
        status: z.string(),
    }).optional(),
}).strict();

export type CaptureOrderResponse = z.infer<typeof CaptureOrderResponseSchema>;

// ============================================
// FUNCIÓN AUXILIAR DE VALIDACIÓN CON MANEJO DE ERRORES
// ============================================

/**
 * Valida datos contra un schema y retorna resultado con errores formateados
 */
export function validateData<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } {
    try {
        const validatedData = schema.parse(data);
        return { success: true, data: validatedData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const path = err.path.join('.');
                errors[path] = err.message;
            });
            return { success: false, errors };
        }
        return { success: false, errors: { _error: 'Validation failed' } };
    }
}
