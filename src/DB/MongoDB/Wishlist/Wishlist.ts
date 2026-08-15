import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistProduct {
    productId: string;
    addedAt?: Date;
}

export interface IWishlist extends Document {
    userId: string;
    products: IWishlistProduct[];
    createdAt?: Date;
    updatedAt?: Date;
}

const WishlistProductSchema = new Schema<IWishlistProduct>({
    productId: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const WishlistSchema = new Schema<IWishlist>({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    products: [WishlistProductSchema],
   
}, { timestamps: true });

export const wishlistModel = mongoose.model<IWishlist>("Wishlist", WishlistSchema);


