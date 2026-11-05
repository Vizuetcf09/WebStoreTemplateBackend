import MercadoPagoClient from '../config/mercadoPagoClient.js';
import ProductModels from '../models/productModels.js';
import { MercadoPagoItem } from '../config/mercadoPagoClient.js';

export interface MercadoPagoCheckoutItem {
    productId: string;
    quantity: number;
    variantId?: number;
}

export class CheckoutValidationError extends Error { }

class MercadoPagoService {
    async createPreference(items: MercadoPagoCheckoutItem[]) {
        const pricedItems: MercadoPagoItem[] = [];

        for (const item of items) {
            if (
                !item ||
                typeof item.productId !== 'string' ||
                !/^[a-fA-F0-9]{24}$/.test(item.productId) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                (item.variantId !== undefined && (!Number.isInteger(item.variantId) || item.variantId < 1))
            ) {
                throw new CheckoutValidationError('Artículo de compra inválido.');
            }

            const product = await ProductModels.getOne(item.productId);
            if (!product || product.status !== 'active') {
                throw new CheckoutValidationError('Uno de los productos ya no está disponible.');
            }

            const variant = item.variantId === undefined
                ? undefined
                : product.variants.find((productVariant) => productVariant.variantId === item.variantId);
            if (item.variantId !== undefined && (!variant || !variant.inStock)) {
                throw new CheckoutValidationError('Una de las variantes ya no está disponible.');
            }
            if (!variant && item.quantity > product.stock) {
                throw new CheckoutValidationError('No hay suficiente inventario para completar la compra.');
            }

            const unitPrice = variant?.price ?? product.price;
            if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
                throw new CheckoutValidationError('El producto tiene un precio no válido.');
            }

            pricedItems.push({
                title: variant?.name ? `${product.name} - ${variant.name}` : product.name,
                quantity: item.quantity,
                unitPrice
            });
        }

        return MercadoPagoClient.createPreference(pricedItems);
    }

    async getPayment(paymentId: string) {
        return MercadoPagoClient.getPayment(paymentId);
    }
}

export default new MercadoPagoService();