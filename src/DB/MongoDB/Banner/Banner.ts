import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
    backgroundImages: string[];
    sideImage: string;
    sideContent: string;
    bannerType?: string;
    isActive?: boolean;
    fontColor?: string;
    fontSize?: string;
    buttonColor?: string;
    buttonSize?: string;
    contentPosition?: string;
    imagePosition?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const BannerSchema = new Schema<IBanner>({
    backgroundImages: { type: [String], required: true },
    sideImage: { type: String },
    sideContent: { type: String },
    bannerType: { type: String, enum: ['FIRST', 'SECOND', 'THIRD'], default: 'FIRST' },
    isActive: { type: Boolean, default: true },
    fontColor: { type: String, default: '#5c3516' },
    fontSize: { type: String, default: '16px' },
    buttonColor: { type: String, default: '' },
    buttonSize: { type: String, default: '16px' },
    contentPosition: { type: String, default: 'LEFT' },
    imagePosition: { type: String, default: 'RIGHT' }
}, { timestamps: true });

export const BannerModel = mongoose.model<IBanner>("Banner", BannerSchema);
