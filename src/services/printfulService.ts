import axios, { AxiosInstance } from 'axios';
import {
  PrintfulStoreProduct,
  PrintfulProductDetail,
  PrintfulApiResponse,
  PrintfulShippingRate,
  CalculateShippingPayload,
  CreateOrderPayload
} from '../types/printfulTypes.js';
import Product from '../models/productModels.js';

type SyncOptions = {
  defaultCategory?: string;
  markupPercent?: number;
};

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

  isConfigured() {
    return Boolean(process.env.PRINTFUL_API_KEY);
  }

  credentialsStatus() {
    return {
      configured: this.isConfigured(),
      storeIdConfigured: Boolean(process.env.PRINTFUL_STORE_ID),
      apiBaseUrl: process.env.PRINTFUL_API_BASE_URL || 'https://api.printful.com'
    };
  }

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

  async getProductsWithSyncStatus() {
    const products = await this.getProducts();
    const ids = products.map((product) => product.id);
    const locals = ids.length ? await Product.findByPrintfulIds(ids) : [];
    const localByPrintfulId = new Map(
      locals.map((item: any) => [item.printfulId, item])
    );

    return products.map((product) => {
      const local = localByPrintfulId.get(product.id);
      return {
        ...product,
        syncStatus: local
          ? (local.status === 'deleted' ? 'local-deleted' : 'synced')
          : 'not_synced',
        localProductId: local?._id ?? null,
        localPrice: local?.price ?? null,
        localCostPrice: local?.costPrice ?? null
      };
    });
  }

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

  async getProductWithPricing(productId: number, markupPercent = 0) {
    const detail = await this.getProduct(productId);
    const mapped = await this.mapSyncDetail(detail, markupPercent);
    const local = await Product.findOne({ printfulId: detail.sync_product.id });

    return {
      ...detail,
      mapped,
      syncStatus: local
        ? (local.status === 'deleted' ? 'local-deleted' : 'synced')
        : 'not_synced',
      localProductId: local?._id ?? null
    };
  }

  private async getCatalogVariantCosts(catalogProductId?: number): Promise<Map<number, number>> {
    if (!catalogProductId) return new Map();

    try {
      const response = await this.api.get<PrintfulApiResponse<{ variants?: Array<{ id: number; price: string | number }> }>>(
        `/products/${catalogProductId}`
      );
      const variants = response.data?.result?.variants ?? [];
      return new Map(
        variants.map((variant) => [
          variant.id,
          typeof variant.price === 'string' ? parseFloat(variant.price) : Number(variant.price || 0)
        ])
      );
    } catch (error) {
      console.warn(`No se pudieron obtener costes del catálogo ${catalogProductId}:`, error);
      return new Map();
    }
  }

  private parseRetailPrice(value: string | number) {
    return typeof value === 'string' ? parseFloat(value) : Number(value || 0);
  }

  private extractColorAndSize(variantName: string) {
    const parts = variantName.split('/').map((s) => s.trim());
    let color: string | undefined;
    let size: string | undefined;

    if (parts.length >= 3) {
      color = parts[parts.length - 2];
      size = parts[parts.length - 1];
    } else if (parts.length === 2) {
      color = parts[0];
      size = parts[1];
    } else if (parts.length === 1) {
      size = parts[0];
    }

    return { color, size };
  }

  private async mapSyncDetail(detail: PrintfulProductDetail, markupPercent = 0) {
    const { sync_product, sync_variants } = detail;
    const catalogProductId = sync_variants.find((variant) => variant.product?.product_id)?.product?.product_id;
    const costByCatalogVariant = await this.getCatalogVariantCosts(catalogProductId);
    const markupFactor = 1 + (Number(markupPercent) || 0) / 100;

    const activeVariants = sync_variants
      .filter((variant) => !variant.is_ignored)
      .map((variant) => {
        const { color, size } = this.extractColorAndSize(variant.name);
        const catalogVariantId = variant.variant_id || variant.product?.variant_id;
        const costPrice = catalogVariantId ? (costByCatalogVariant.get(catalogVariantId) || 0) : 0;
        const retailPrice = this.parseRetailPrice(variant.retail_price);
        const salePrice = retailPrice > 0
          ? retailPrice
          : Number((costPrice * markupFactor).toFixed(2));

        return {
          variantId: variant.id,
          externalId: variant.external_id || undefined,
          name: variant.name,
          size,
          color,
          price: salePrice,
          costPrice,
          inStock: true,
          previewUrl: variant.product?.image
        };
      });

    const salePrices = activeVariants.map((variant) => variant.price).filter((price) => price > 0);
    const costPrices = activeVariants.map((variant) => variant.costPrice || 0).filter((price) => price > 0);

    return {
      printfulId: sync_product.id,
      externalId: sync_product.external_id || undefined,
      name: sync_product.name,
      description: sync_product.name,
      price: salePrices.length ? Math.min(...salePrices) : 0,
      costPrice: costPrices.length ? Math.min(...costPrices) : 0,
      category: 'Printful',
      stock: sync_product.synced || activeVariants.length,
      imageUrl: sync_product.thumbnail_url,
      images: sync_product.thumbnail_url ? [sync_product.thumbnail_url] : [],
      variants: activeVariants,
      source: 'printful' as const
    };
  }

  async syncProductToDatabase(printfulProductId: number, defaultCategory = 'General', markupPercent = 0) {
    try {
      const detail = await this.getProduct(printfulProductId);
      const mapped = await this.mapSyncDetail(detail, markupPercent);
      mapped.category = defaultCategory || 'Printful';

      const existing = await Product.findOne({ printfulId: mapped.printfulId });

      if (existing) {
        if (mapped.externalId !== undefined) {
          existing.externalId = mapped.externalId;
        }
        existing.variants = mapped.variants as any;
        existing.costPrice = mapped.costPrice;
        existing.stock = mapped.stock;
        existing.imageUrl = mapped.imageUrl;
        existing.images = mapped.images;
        existing.source = 'printful';
        existing.markModified('variants');
        if (!existing.category) existing.category = mapped.category;
        if (existing.status === 'deleted') {
          existing.status = 'active';
          existing.deletedAt = null;
        }
        await existing.save();
        return existing;
      }

      const productData = mapped.externalId === undefined
        ? { ...mapped, status: 'active' as const }
        : { ...mapped, externalId: mapped.externalId, status: 'active' as const };

      return await Product.create(productData);
    } catch (error) {
      console.error(`Error syncing product ${printfulProductId} to DB:`, error);
      throw error;
    }
  }

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

  async syncAllProductsToDatabase(defaultCategory = 'General', markupPercent = 0) {
    return this.importProducts({ defaultCategory, markupPercent });
  }

  async importProducts({ defaultCategory = 'General', markupPercent = 0, ids }: SyncOptions & { ids?: number[] } = {}) {
    const products = await this.getProducts();
    const selected = ids?.length
      ? products.filter((product) => ids.includes(product.id) && !product.is_ignored)
      : products.filter((product) => !product.is_ignored);

    const syncedProducts = [];
    for (const product of selected) {
      const synced = await this.syncProductToDatabase(product.id, defaultCategory, markupPercent);
      syncedProducts.push(synced);
    }

    return syncedProducts;
  }
}
