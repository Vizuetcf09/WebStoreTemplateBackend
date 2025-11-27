export interface Product extends Document {
    id?: string
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
}
