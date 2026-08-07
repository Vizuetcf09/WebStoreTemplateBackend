import { Request, Response } from 'express';
import { z } from 'zod';
import { PrintfulService } from '../services/printfulService.js';
import { calculateShippingSchema, createOrderSchema } from '../schemas/printfulSchemas.js';

// Validar credenciales
const apiKey = process.env.PRINTFUL_API_KEY;
const storeId = process.env.PRINTFUL_STORE_ID;

if (!apiKey) {
  console.warn('⚠️ WARNING: PRINTFUL_API_KEY no está definida en las variables de entorno.');
}

const printfulService = new PrintfulService(apiKey || '', storeId || '');

/**
 * Helper para formatear y devolver errores detallados de Printful, Zod o servidor
 */
const handleError = (res: Response, error: any, defaultMessage: string) => {
  console.error(`❌ [Printful Error]:`, error?.response?.data || error?.message || error);

  // 1. Error de validación Zod
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.issues
    });
  }

  // 2. Error de respuesta de la API de Printful (Axios/Fetch)
  if (error?.response) {
    return res.status(error.response.status || 500).json({
      success: false,
      error: defaultMessage,
      statusCode: error.response.status,
      // Printful devuelve la razón exacta en 'data'
      printfulError: error.response.data || null,
      message: error.response.data?.error?.message || error.response.data?.result || error.message
    });
  }

  // 3. Error de red (Printful no respondió)
  if (error?.request) {
    return res.status(503).json({
      success: false,
      error: 'Printful service unreachable',
      message: 'No response received from Printful API'
    });
  }

  // 4. Error genérico interno
  return res.status(500).json({
    success: false,
    error: defaultMessage,
    message: error?.message || 'Internal Server Error',
    rawError: process.env.NODE_ENV === 'development' ? error : undefined
  });
};

export const printfulController = {
  /**
   * GET /api/printful/products
   */
  // En tu controlador de Printful:
  async getProducts(req: Request, res: Response) {
    try {
      // Validar que la API Key exista antes de llamar al servicio
      if (!process.env.PRINTFUL_API_KEY) {
        console.error('ERROR: PRINTFUL_API_KEY no está definida en las variables de entorno.');
        return res.status(500).json({
          error: 'Configuración del servidor incompleta: falta PRINTFUL_API_KEY'
        });
      }

      const products = await printfulService.getProducts();
      return res.status(200).json(products);
    } catch (error: any) {
      // Imprimir el mensaje real de Axios/Printful en la consola de Vercel
      console.error('Printful Controller Error:', error.response?.data || error.message);

      return res.status(error.response?.status || 500).json({
        message: 'Error al comunicarse con la API de Printful',
        details: error.response?.data || error.message
      });
    }
  },

  /**
   * GET /api/printful/products/:id
   */
  getProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
        return res.status(400).json({
          success: false,
          error: 'ID de producto inválido'
        });
      }

      const product = await printfulService.getProduct(productId);

      res.json({
        success: true,
        data: product
      });
    } catch (error: any) {
      handleError(res, error, 'Error fetching product');
    }
  },

  /**
   * POST /api/printful/shipping
   */
  calculateShipping: async (req: Request, res: Response) => {
    try {
      const validatedData = calculateShippingSchema.parse(req.body);

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
      handleError(res, error, 'Error calculating shipping');
    }
  },

  /**
   * POST /api/printful/orders
   */
  createOrder: async (req: Request, res: Response) => {
    try {
      const validatedData = createOrderSchema.parse(req.body);

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
      handleError(res, error, 'Error creating order');
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
      handleError(res, error, 'Error fetching order');
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
      handleError(res, error, 'Error canceling order');
    }
  }
};