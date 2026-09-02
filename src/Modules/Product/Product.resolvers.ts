import { ProductService } from "./Product.services.js";

export const ProductResolver = {
    Query: {
        getAllProducts: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.getAllProducts(__.search, __.page, __.limit, __.filters);
        },

        getProductById: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.getProductById(__.id);
        },
        getProduct: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.getAllProducts(__.search, __.page, __.limit);
        },
        getProductsByCategoryCode: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.getProductsByCategoryCode(__.code, __.search, __.page, __.limit, __.sort, __.filters);
        },
        getProductsByTagCode: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.getProductsByTagCode(__.code, __.search, __.page, __.limit, __.sort, __.filters);
        },
        getCategoryFilters: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.getCategoryFilters(__.code);
        },
        getRelatedProducts: async (_: any, { productId, limit }: { productId: string, limit?: number }, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return await ProductService.getRelatedProducts(productId, limit);
        }
    },
    Mutation: {
        createProduct: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.createProduct(__.input);
        },
        updateProduct: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.updateProduct(__.id, __.input);
        },
        deleteProduct: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.deleteProduct(__.id);
        },
        addProductSize: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductService.addProductSize(__.productId, __.input);
        }
    }
};