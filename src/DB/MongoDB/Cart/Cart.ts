import mongoose, { Schema, Document } from "mongoose";

export interface ICartProduct {
    productId: string;
    quantity: number;
    size: string;
}

export interface ICart extends Document {
    userId: string;
    shopId: string;
    products: ICartProduct[];
    status: "ACTIVE" | "INACTIVE";
    createdAt?: Date;
    updatedAt?: Date;
}

const CartProductSchema = new Schema<ICartProduct>({
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    size: {
        type: String,
        default: "Default"
    }
});

const CartSchema = new Schema<ICart>({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    shopId: {
        type: String,
        required: true
    },
    products: [CartProductSchema],
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });

export const cartModel = mongoose.model<ICart>("Cart", CartSchema);
