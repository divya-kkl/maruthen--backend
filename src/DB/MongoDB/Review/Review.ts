import mongoose, { Schema,Document} from "mongoose";

export interface IReview extends Document {
    productId : mongoose.Types.ObjectId | string;
    orderId?: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    userName: string;
    rating: number;
    comment?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ReviewSchema: Schema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment:{
        type:String
    },
    
},{timestamps: true});

export const ReviewModel = (mongoose.models.Review as mongoose.Model<IReview>) || mongoose.model<IReview>("Review", ReviewSchema);

