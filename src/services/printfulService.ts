import axios, { AxiosInstance } from 'axios';
import {
  PrintfulStoreProduct,
  PrintfulProductDetail,
  PrintfulApiResponse,
  PrintfulShippingRate,
  CalculateShippingPayload,
  CreateOrderPayload
} from '../types/printfulTypes.js';
import Product from '../models/productModels.js'; // Ajusta la ruta a tu modelo Mongoose

export class PrintfulService {
  private api: AxiosInstance;

  constructor(apiKey: string, storeId?: string) {
    const baseURL = (process.env.PRINTFUL_API_BASE_URL || 'https://api.printful.com').replace(/\/$/, '');

    this.api = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(storeId ? { 'X-PF-Store-Id': storeId } : {})
      }
    });
  }

  /**
   * Obtener lista de Sync Products de la tienda (resumen)
   * GET https://api.printful.com/store/products
   */
  async getProducts(): Promise<PrintfulStoreProduct[]> {
    try {
      const response = await this.api.get<PrintfulApiResponse<PrintfulStoreProduct[]>>(
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
   * Obtener detalle completo de un Sync Product y sus variantes
   * GET https://api.printful.com/store/products/{id}
   */
  async getProduct(productId: number): Promise<PrintfulProductDetail> {
    try {
      const response = await this.api.get<PrintfulApiResponse<PrintfulProductDetail>>(
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
   * Consulta Printful y guarda/actualiza el producto en MongoDB con sus variantes
   */
  async syncProductToDatabase(printfulProductId: number, defaultCategory: string = 'General') {
    try {
      const detail = await this.getProduct(printfulProductId);
      const { sync_product, sync_variants } = detail;

      // Mapear las variantes activas extrayendo talla, color y precio
      const activeVariants = sync_variants
        .filter((variant) => !variant.is_ignored)
        .map((variant) => {
          // En Printful las variantes suelen venir como "Nombre / Color / Talla" o "Color / Talla"
          const parts = variant.name.split('/').map((s) => s.trim());
          let color: string | undefined = undefined;
          let size: string | undefined = undefined;

          if (parts.length >= 3) {
            color = parts[parts.length - 2];
            size = parts[parts.length - 1];
          } else if (parts.length === 2) {
            color = parts[0];
            size = parts[1];
          } else if (parts.length === 1) {
            size = parts[0];
          }

          return {
            variantId: variant.id,
            externalId: variant.external_id || undefined,
            name: variant.name,
            size,
            color,
            price: typeof variant.retail_price === 'string'
              ? parseFloat(variant.retail_price)
              : variant.retail_price,
            inStock: true,
            previewUrl: variant.product?.image
          };
        });

      // Calcular precio base (menor precio de variante)
      const basePrice = activeVariants.length > 0
        ? Math.min(...activeVariants.map((v) => v.price))
        : 0;

      const productData = {
        printfulId: sync_product.id,
        externalId: sync_product.external_id || undefined,
        name: sync_product.name,
        description: sync_product.name,
        price: basePrice,
        category: defaultCategory,
        stock: sync_product.synced || activeVariants.length,
        imageUrl: sync_product.thumbnail_url,
        variants: activeVariants
      };

      // Guardar o actualizar en MongoDB
      return await Product.findOneAndUpdate(
        { printfulId: sync_product.id },
        productData,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error(`Error syncing product ${printfulProductId} to DB:`, error);
      throw error;
    }
  }

  /**
   * Calcular costo de envío
   * POST https://api.printful.com/shipping/rates
   */
  async calculateShipping(shippingData: CalculateShippingPayload): Promise<PrintfulShippingRate[]> {
    try {
      const response = await this.api.post<PrintfulApiResponse<PrintfulShippingRate[]>>(
        '/shipping/rates',
        {
          recipient: shippingData.to,
          items: shippingData.items,
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
   * POST https://api.printful.com/orders
   */
  async createOrder(order: CreateOrderPayload): Promise<any> {
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
   * GET https://api.printful.com/orders/{id}
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
   * PUT https://api.printful.com/orders/{id}
   */
  async updateOrder(orderId: string, updates: Partial<CreateOrderPayload>): Promise<any> {
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
   * DELETE https://api.printful.com/orders/{id}
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

  /**
   * Consulta todos los Sync Products de la tienda y los guarda/actualiza en MongoDB
   */
  async syncAllProductsToDatabase(defaultCategory: string = 'General') {
    try {
      const products = await this.getProducts();
      const syncedProducts = [];

      for (const product of products) {
        if (!product.is_ignored) {
          const synced = await this.syncProductToDatabase(product.id, defaultCategory);
          syncedProducts.push(synced);
        }
      }

      return syncedProducts;
    } catch (error) {
      console.error('Error syncing all products to DB:', error);
      throw error;
    }
  }
}