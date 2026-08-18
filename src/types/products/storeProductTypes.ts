// Estructura simplificada para Cards o Vista de Tienda y PayPal Request
export interface StoreProductsTypes {
  _id?: string;
  printfulId?: number;
  name?: string;
  price?: number;
  productName?: string;
  productPrice?: number;
  category?: string;
  imageUrl?: string;
  inStock?: boolean;
  availableVariantsCount?: number;
}