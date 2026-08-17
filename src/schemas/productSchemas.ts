import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
    variantId: { type: Number, required: true }, // ID de variante en Printful (necesario para la API)
    externalId: { type: String },
    name: { type: String },                       // Ej: "Blanco / M"
    size: { type: String },                       // Ej: "M"
    color: { type: String },                      // Ej: "White"
    price: { type: Number, required: true },      // Precio de venta específico de la variante
    inStock: { type: Boolean, default: true },
    previewUrl: { type: String }                  // Mockup/vista previa específica de variante
});

const ProductSchema = new mongoose.Schema({
    // Referencias Printful
    printfulId: { type: Number, unique: true, sparse: true },
    externalId: { type: String },

    // Información General
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: [0, 'The price must be greater than zero.'], required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },

    // Lista de variantes de Printful
    variants: [ProductVariantSchema]
}, {
    timestamps: true,
});

export default mongoose.model('products', ProductSchema);