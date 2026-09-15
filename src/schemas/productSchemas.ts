import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
    variantId: { type: Number, required: true },
    externalId: { type: String },
    name: { type: String },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    previewUrl: { type: String }
});

const ProductSchema = new mongoose.Schema({
    printfulId: { type: Number, unique: true, sparse: true },
    externalId: { type: String },
    source: { type: String, enum: ['local', 'printful'], default: 'local' },

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: [0, 'The price must be greater than zero.'], required: true },
    costPrice: { type: Number, min: [0, 'The cost must be greater than zero.'], default: 0 },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
    deletedAt: { type: Date, default: null },

    variants: [ProductVariantSchema]
}, {
    timestamps: true,
});

export default mongoose.model('products', ProductSchema);
