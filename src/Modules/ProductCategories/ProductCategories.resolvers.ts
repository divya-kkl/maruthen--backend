import { ProductCategoryService } from "./ProductCategories.services.js";

import { SubCategoryService } from "../SubCategories/SubCategories.services.js";

export const ProductCategoryResolver = {
    Query: {
        getAllProductCategories: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductCategoryService.getAllProductCategories(__.search, __.page, __.limit);
        },

        getProductCategoryById: async (_: any, { id }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductCategoryService.getProductCategoryById(id);
        },
        getProductCategories: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductCategoryService.getAllProductCategories(__.search, __.page, __.limit, "ACTIVE");
        }
    },
    Mutation: {
        createProductCategory: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductCategoryService.createProductCategory(__.input);
        },
        updateProductCategory: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductCategoryService.updateProductCategory(__.id, __.input);
        },
        deleteProductCategory: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ProductCategoryService.deleteProductCategory(__.id);
        }
    },
    ProductCategory: {
        subCategories: async (parent: any) => {
            const allSubCategories = await SubCategoryService.getAllSubCategories();
            return allSubCategories.filter((sub: any) => sub.productCategoryId === parent.id.toString());
        }
    }
};
