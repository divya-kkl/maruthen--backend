import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
    name: string;
    code: string;
    description?: string;
    status: "ACTIVE" | "INACTIVE";
    createdTime: Date;
}

const tagSchema = new Schema<ITag>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
            uppercase: true,
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        },
        createdTime: {
            type: Date,
            default: Date.now,
        },
    },
);

export const tagModel = mongoose.model<ITag>("Tag", tagSchema);
