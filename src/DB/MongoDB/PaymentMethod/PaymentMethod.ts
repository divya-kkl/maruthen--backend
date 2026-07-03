import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentMethod extends Document {
    name: string;
    value: string;
    description: string;
    icon: string;
    status: "ACTIVE" | "INACTIVE";
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    icon: {
        type: String,
        default: "💳"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const paymentMethodModel = mongoose.model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema);
