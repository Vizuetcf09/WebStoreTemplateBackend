// ./src/models/printfulModels.ts
import { Schema, model } from 'mongoose';

const PrintfulTokenSchema = new Schema({
    storeId: { type: Number, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Number, required: true }, // Timestamp
});

export const PrintfulToken = model('PrintfulToken', PrintfulTokenSchema);