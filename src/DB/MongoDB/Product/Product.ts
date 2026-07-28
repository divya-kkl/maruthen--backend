import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
    color: string;
    size: string;
    stock: number;
}

export interface IProduct extends Document {
    name: string;
    price: number;
    mrp: number;
    discountPercentage: number;
    images: string[];
    brand: string;
    isFeatured?: boolean;
    productCategoriesID: mongoose.Types.ObjectId | string;
    tags?: (mongoose.Types.ObjectId | string)[];
    variants: IVariant[];
    description?: string;
    material?: string;
    embellishment?: string;
    neck?: string;
    sleeves?: string;
    closure?: string;
    lining?: string;
    washCare?: string;
    ironCare?: string;
    createdAt?: Date;
    updatedAt?: Date;
    couponCode?: string;
    rating?: number;
    numReviews?: number;
}

const VariantSchema: Schema = new Schema({
    color: {
        type: String,
        required: true
    },
    size:
    {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
});

const ProductSchema: Schema = new Schema({
    name:
    {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    productCategoriesID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategories",
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    variants: [VariantSchema],
    description: { type: String },
    material: { type: String },
    embellishment: { type: String },
    neck: { type: String },
    sleeves: { type: String },
    closure: { type: String },
    lining: { type: String },
    washCare: { type: String },
    ironCare: { type: String },
    couponCode: { type: String },
    rating: {
        type:Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const productModel = (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);