import mongoose, { Schema, Document } from "mongoose";

export interface IAddress {
    userId?: mongoose.Types.ObjectId;
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

export interface IUser extends Document {
    username?: string,
    email?: string,
    password?: string,
    country: string,
    address: string,
    city: string,
    state: string,
    phone_number: string,
    pincode: number,
    addresses?: IAddress[],
    createdTime: Date;
    gender: string;
    isEmailVerified?: boolean;
}

const AddressSchema = new Schema<IAddress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        firstName: String,
        lastName: String,
        address: String,
        apartment: String,
        city: String,
        state: String,
        pincode: Number,
        country: String,
        phone: String,
        isDefault: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"]
    },
    country: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    phone_number: {
        type: String
    },
    pincode: {
        type: Number
    },
    addresses: {
        type: [AddressSchema],
        default: []
    },
    createdTime: {
        type: Date,
        default: Date.now()
    },
    isEmailVerified: { type: Boolean, default: false }

}
);

export const userModel = mongoose.model<IUser>("User", UserSchema);
