import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: [0, 'The price must be greater than zero.'], required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    imageUrl: { type: String, required: true },
}, {
    timestamps: true,
});

export default mongoose.model('products', productSchema);