import { Document } from 'mongoose';

// Sub-documento para variantes locales
export interface ProductVariant {
  _id?: string;
  variantId: number;         // variant_id de Printful
  externalId?: string;
  name?: string;             // Ej: "Blanco / M"
  size?: string;             // Ej: "M"
  color?: string;            // Ej: "White"
  price: number;             // Precio específico de la variante
  inStock: boolean;
  previewUrl?: string;       // Vista previa/mockup de la variante
}

// Documento Mongoose principal para el catálogo
export interface ProductTypes extends Document {
  printfulId?: number;
  externalId?: string;
  name: string;
  description: string;
  price: number;             // Precio base ("Desde $X")
  category: string;
  stock: number;
  imageUrl: string;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}