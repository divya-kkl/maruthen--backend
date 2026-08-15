import { WishlistService } from "./Wishlist.services.js";

export const WishlistResolver = {
    Query: {
        getWishlist: async (_: any, __: any, context: any) => {
            return WishlistService.getWishlist(__.userId);  
        }
    },
    Mutation: {
        addToWishlist: async (_: any, __: any, context: any) => {
            return WishlistService.addProductToWishlist(__.input);
        },
        removeFromWishlist: async (_: any, __: any, context: any) => {
            return WishlistService.removeProductFromWishlist(__.input);
        }
    }
};
