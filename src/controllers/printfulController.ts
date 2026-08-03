import { Request, Response } from 'express';
import { PrintfulService } from '../services/printfulService.js';
import { z } from 'zod';

// Schemas de validación con Zod
const shippingSchema = z.object({
  to: z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    address1: z.string().min(1, 'La dirección es requerida'),
    address2: z.string().optional(),
    city: z.string().min(1, 'La ciudad es requerida'),
    state_code: z.string().min(2, 'El código de estado es requerido'),
    country_code: z.string().length(2, 'El código de país debe ser 2 caracteres'),
    zip: z.string().min(1, 'El código postal es requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional()
  }),
  items: z.array(
    z.object({
      variant_id: z.number().min(1),
      quantity: z.number().min(1)
    })
  )
});

const orderSchema = z.object({
  external_id: z.string().optional(),
  shipping: z.enum(['STANDARD', 'EXPRESS']),
  recipient: z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    address1: z.string().min(1, 'La dirección es requerida'),
    address2: z.string().optional(),
    city: z.string().min(1, 'La ciudad es requerida'),
    state_code: z.string().min(2, 'El código de estado es requerido'),
    country_code: z.string().length(2, 'El código de país debe ser 2 caracteres'),
    zip: z.string().min(1, 'El código postal es requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional()
  }),
  items: z.array(
    z.object({
      variant_id: z.number().min(1),
      quantity: z.number().min(1),
      sync_variant_id: z.number().optional()
    })
  )
});

const printfulService = new PrintfulService(
  process.env.PRINTFUL_API_KEY || '',
  process.env.PRINTFUL_STORE_ID || ''
);

export const printfulController = {
  /**
   * GET /api/printful/products
   */
  getProducts: async (req: Request, res: Response) => {
    try {
      const products = await printfulService.getProducts();
      res.json({
        success: true,
        data: products
      });
    } catch (error: any) {
      console.error('Error in getProducts:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching products',
        message: error.message
      });
    }
  },

  /**
   * GET /api/printful/products/:id
   */
  getProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await printfulService.getProduct(parseInt(id));

      res.json({
        success: true,
        data: product
      });
    } catch (error: any) {
      console.error('Error in getProduct:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching product',
        message: error.message
      });
    }
  },

  /**
   * POST /api/printful/shipping
   */
  calculateShipping: async (req: Request, res: Response) => {
    try {
      const validatedData = shippingSchema.parse(req.body);

      const recipient = {
        name: validatedData.to.name,
        address1: validatedData.to.address1,
        city: validatedData.to.city,
        state_code: validatedData.to.state_code,
        country_code: validatedData.to.country_code,
        zip: validatedData.to.zip,
        email: validatedData.to.email,
        ...(validatedData.to.address2 !== undefined ? { address2: validatedData.to.address2 } : {}),
        ...(validatedData.to.phone !== undefined ? { phone: validatedData.to.phone } : {})
      };

      const rates = await printfulService.calculateShipping({
        recipient,
        items: validatedData.items,
        shipping: 'STANDARD'
      });

      res.json({
        success: true,
        data: rates
      });
    } catch (error: any) {
      console.error('Error in calculateShipping:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.issues
        });
      }

      res.status(500).json({
        success: false,
        error: 'Error calculating shipping',
        message: error.message
      });
    }
  },

  /**
   * POST /api/printful/orders
   */
  createOrder: async (req: Request, res: Response) => {
    try {
      const validatedData = orderSchema.parse(req.body);

      // Build payload ensuring external_id is omitted when undefined to satisfy strict typing
      const orderPayload = {
        shipping: validatedData.shipping,
        recipient: validatedData.recipient,
        items: validatedData.items,
        ...(validatedData.external_id !== undefined ? { external_id: validatedData.external_id } : {})
      };

      const order = await printfulService.createOrder(orderPayload as any);

      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error: any) {
      console.error('Error in createOrder:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.issues
        });
      }

      res.status(500).json({
        success: false,
        error: 'Error creating order',
        message: error.message
      });
    }
  },

  /**
   * GET /api/printful/orders/:id
   */
  getOrder: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await printfulService.getOrder(id);

      res.json({
        success: true,
        data: order
      });
    } catch (error: any) {
      console.error('Error in getOrder:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching order',
        message: error.message
      });
    }
  },

  /**
   * DELETE /api/printful/orders/:id
   */
  cancelOrder: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await printfulService.cancelOrder(id);

      res.json({
        success: true,
        message: 'Order cancelled successfully'
      });
    } catch (error: any) {
      console.error('Error in cancelOrder:', error);
      res.status(500).json({
        success: false,
        error: 'Error canceling order',
        message: error.message
      });
    }
  }
};