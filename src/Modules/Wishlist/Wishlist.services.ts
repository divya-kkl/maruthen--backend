import { wishlistModel } from "../../DB/MongoDB/Wishlist/Wishlist.js";

export const WishlistService = {

    async getWishlist(userId: string){
        if (!userId) {
            throw new Error ("User ID is required");
        }

        const item = await wishlistModel.findOne({ userId });

        if(!item) {
            return{
                userId,
                products: []
            }
        }

        return {
            id: item._id,
            userId: item.userId,
            products : item.products.map(p =>({
                productId: p.productId,
                addedAt: p.addedAt?.toString()
            })),
            createdAt: item.createdAt?.toString(),
            updatedAt: item.updatedAt?.toString()
        };
    },

    async addProductToWishlist(input: any = {}){
        const { userId, productId } = input;

        if(!userId){
            throw new Error("User ID is required");
        }
        if(!productId) {
            throw new Error ("Product ID is required");
        }
        
        let wishlist = await wishlistModel.findOne ({ userId });

        if (!wishlist) {
            wishlist = await wishlistModel.create({
                userId,
                products: [{ productId }]
            });
        }
        else {
            const productExists = wishlist.products.some(p => p.productId === productId);

            if (!productExists){
                wishlist.products.push({ productId });
                await wishlist.save();
            }
        }
        return {
            id: wishlist._id,
            userId: wishlist.userId,
            products: wishlist.products.map(p => ({
                productId: p.productId,
                addedAt: p.addedAt?.toString()
            })),
            createdAt: wishlist.createdAt?.toString(),
            updatedAt: wishlist.updatedAt?.toString()
        }
    },

    async removeProductFromWishlist(input: any = {}){
        const { userId, productId } = input;

        if (!userId || !productId) {
            throw new Error ("User ID and Product ID are required");
        }
        const wishlist = await wishlistModel.findOneAndUpdate(
            { userId },
            { $pull : { products: { productId }}},
            { new: true }
        );
        if (!wishlist){
            throw new Error("Wishlist not found");
        }

        return{
            id: wishlist._id,
            userId: wishlist.userId,
            products: wishlist.products.map( p => ({
                productId: p.productId,
                addedAt: p.addedAt?.toString()
            })),
            createdAt: wishlist.createdAt?.toString(),
            updatedAt: wishlist.updatedAt?.toString()
        }
        
    }
}