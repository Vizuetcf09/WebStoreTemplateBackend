import axios, { AxiosInstance } from 'axios';
import {
  PrintfulProduct,
  PrintfulOrder,
  PrintfulApiResponse,
  PrintfulShippingRate
} from '../types/printfulTypes.js';

export class PrintfulService {
  private api: AxiosInstance;

  constructor(apiKey: string, storeId?: string) {
    this.api = axios.create({
      baseURL: process.env.PRINTFUL_API_BASE_URL || 'https://api.printful.com',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Solo necesario si usas un token a nivel de cuenta (Account level).
        // Si tu token es a nivel de Store, PUEDES quitar esta línea.
        ...(storeId ? { 'X-PF-Store-Id': storeId } : {})
      }
    });
  }

  /**
   * Obtener lista de Sync Products (productos de tu tienda)
   * Endpoint real: GET /store/products
   */
  async getProducts(): Promise<PrintfulProduct[]> {
    try {
      const response = await this.api.get<PrintfulApiResponse<PrintfulProduct[]>>(
        '/store/products'
      );

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result || [];
    } catch (error) {
      console.error('Error fetching Printful products:', error);
      throw error;
    }
  }

  /**
   * Obtener detalles de un Sync Product
   * Endpoint real: GET /store/products/{id}
   */
  async getProduct(productId: number): Promise<PrintfulProduct> {
    try {
      const response = await this.api.get<PrintfulApiResponse<PrintfulProduct>>(
        `/store/products/${productId}`
      );

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      console.error(`Error fetching Printful product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Calcular costo de envío
   * Endpoint real: POST /shipping/rates
   */
  async calculateShipping(order: PrintfulOrder): Promise<PrintfulShippingRate[]> {
    try {
      const response = await this.api.post<PrintfulApiResponse<PrintfulShippingRate[]>>(
        '/shipping/rates',
        {
          recipient: order.recipient,
          items: order.items,
          currency: 'USD'
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result || [];
    } catch (error) {
      console.error('Error calculating shipping:', error);
      throw error;
    }
  }

  /**
   * Crear orden en Printful
   * Endpoint real: POST /orders
   */
  async createOrder(order: PrintfulOrder): Promise<any> {
    try {
      const response = await this.api.post<PrintfulApiResponse<any>>(
        '/orders',
        order
      );

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      console.error('Error creating Printful order:', error);
      throw error;
    }
  }

  /**
   * Obtener estado de una orden
   * Endpoint real: GET /orders/{id}
   */
  async getOrder(orderId: string): Promise<any> {
    try {
      const response = await this.api.get<PrintfulApiResponse<any>>(
        `/orders/${orderId}`
      );

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      console.error(`Error fetching Printful order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar orden
   * Endpoint real: PUT /orders/{id}
   */
  async updateOrder(orderId: string, updates: Partial<PrintfulOrder>): Promise<any> {
    try {
      const response = await this.api.put<PrintfulApiResponse<any>>(
        `/orders/${orderId}`,
        updates
      );

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      console.error(`Error updating Printful order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Cancelar orden
   * Endpoint real: DELETE /orders/{id}
   */
  async cancelOrder(orderId: string): Promise<void> {
    try {
      const response = await this.api.delete<PrintfulApiResponse<void>>(
        `/orders/${orderId}`
      );

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }
    } catch (error) {
      console.error(`Error canceling Printful order ${orderId}:`, error);
      throw error;
    }
  }
}