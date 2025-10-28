import mongoose, { Schema } from 'mongoose';
import type { Product } from '../types/productTypes.ts';

const productSchema: Schema<Product> = new Schema<Product>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        inStock: { type: Boolean, required: true, default: true },
    },
    {
        timestamps: true,
    }
)

export const ProductModel = mongoose.model<Product>('Product', productSchema);
