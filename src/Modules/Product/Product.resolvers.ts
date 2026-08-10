import { ProductService } from "./Product.services.js";

export const ProductResolver = {
    Query: {
        getAllProducts: async (_: any, __: any, context: any) => {
            return ProductService.getAllProducts(__.search, __.page, __.limit, __.filters);
        },

        getProductById: async (_: any, __: any, context: any) => {
            return ProductService.getProductById(__.id);
        },
        getProduct: async (_: any, __: any, context: any) => {
            return ProductService.getAllProducts(__.search, __.page, __.limit);
        },
        getProductsByCategoryCode: async (_: any, __: any, context: any) => {
            return ProductService.getProductsByCategoryCode(__.code, __.search, __.page, __.limit, __.sort, __.filters);
        },
        getProductsByTagCode: async (_: any, __: any, context: any) => {
            return ProductService.getProductsByTagCode(__.code, __.search, __.page, __.limit, __.sort, __.filters);
        },
        getCategoryFilters: async (_: any, __: any, context: any) => {
            return ProductService.getCategoryFilters(__.code);
        },
        getRelatedProducts: async (_: any, { productId, limit }:{ productId: string, limit?: number}) =>{
            return await ProductService.getRelatedProducts( productId, limit);
        }
    },
    Mutation: {
        createProduct: async (_: any, __: any, context: any) => {
            return ProductService.createProduct(__.input);
        },
        updateProduct: async (_: any, __: any, context: any) => {
            return ProductService.updateProduct(__.id, __.input);
        },
        deleteProduct: async (_: any, __: any, context: any) => {
            return ProductService.deleteProduct(__.id);
        },
        addProductSize: async (_: any, __: any, context: any) => {
            return ProductService.addProductSize(__.productId, __.input);
        }
    }
};