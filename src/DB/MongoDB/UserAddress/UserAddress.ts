import mongoose, { Schema, Document } from "mongoose";

export interface IUserAddress extends Document {
    userId: mongoose.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    address?: string;
    apartment?: string;
    city?: string;
    state?: string;
    pincode?: number;
    country?: string;
    phone?: string;
    isDefault?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserAddressSchema = new Schema<IUserAddress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        address: {
            type: String
        },
        apartment: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        pincode: {
            type: Number
        },
        country: {
            type: String
        },
        phone: {
            type: String
        },
        isDefault: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const UserAddressModel = mongoose.model<IUserAddress>("UserAddress", UserAddressSchema);