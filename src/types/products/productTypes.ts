import { Document } from 'mongoose';

export type ProductStatus = 'active' | 'inactive' | 'deleted';
export type ProductSource = 'local' | 'printful';

export interface ProductVariant {
  _id?: string;
  variantId: number;
  externalId?: string;
  name?: string;
  size?: string;
  color?: string;
  price: number;
  costPrice?: number;
  inStock: boolean;
  previewUrl?: string;
}

export interface ProductTypes extends Document {
  printfulId?: number;
  externalId?: string;
  source: ProductSource;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  category: string;
  stock: number;
  imageUrl: string;
  images: string[];
  status: ProductStatus;
  deletedAt?: Date | null;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
