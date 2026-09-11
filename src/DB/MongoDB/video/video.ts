import mongoose, { Document, Schema } from "mongoose";

export interface IVideo extends Document {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const VideoSchema = new Schema<IVideo>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const VideoModel = mongoose.model<IVideo>("Video", VideoSchema);