import { CartService } from "./Cart.services.js";

export const CartResolver = {
    Query: {
        getAllCarts: async (_: any, __: any, context: any) => {
            return CartService.getAllCarts(__.search, __.page, __.limit);
        },
        getCartById: async (_: any, __: any, context: any) => {
            return CartService.getCartById(__.id);
        },
        getCart: async (_: any, __: any, context: any) => {
            return CartService.getAllCarts(__.search, __.page, __.limit);
        },
        getCartByUserId: async (_: any, __: any, context: any) => {
            return CartService.getCartByUserId(__.userId);
        }
    },
    Mutation: {
        addToCart: async (_: any, __: any, context: any) => {
            return CartService.addToCart(__.userId, __.shopId, __.productId, __.quantity, __.size);
        },
        removeFromCart: async (_: any, __: any, context: any) => {
            return CartService.removeFromCart(__.userId, __.productId, __.size);
        },
        clearCart: async (_: any, __: any, context: any) => {
            return CartService.clearCart(__.userId);
        }
    }
};
