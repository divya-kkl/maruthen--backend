import mongoose, { Document, Schema } from "mongoose";

export interface IImage extends Document {
    title: string;
    description?: string;
    imageUrl: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const ImageSchema = new Schema<IImage>({
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const ImageModel = mongoose.model<IImage>("Image", ImageSchema);
