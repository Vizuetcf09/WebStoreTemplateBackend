// Estructura simplificada para Cards o Vista de Tienda
export interface StoreProductsTypes {
  _id: string;
  printfulId?: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  availableVariantsCount?: number;
}