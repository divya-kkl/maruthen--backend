import { SubCategoryService } from "./SubCategories.services.js";

export const SubCategoryResolver = {
    Query: {
        getAllSubCategories: async (_: any, __: any, context: any) => {
            return SubCategoryService.getAllSubCategories(__.search, __.page, __.limit);
        },
        getSubCategoryById: async (_: any, __: any, context: any) => {
            return SubCategoryService.getSubCategoryById(__.id);
        },
        getSubCategory: async (_: any, __: any, context: any) => {
            return SubCategoryService.getAllSubCategories(__.search, __.page, __.limit, "ACTIVE");
        }
    },
    Mutation: {
        createSubCategory: async (_: any, __: any, context: any) => {
            return SubCategoryService.createSubCategory(__.input);
        },
        updateSubCategory: async (_: any, __: any, context: any) => {
            return SubCategoryService.updateSubCategory(__.id, __.input);
        },
        deleteSubCategory: async (_: any, __: any, context: any) => {
            return SubCategoryService.deleteSubCategory(__.id);
        }
    }
};
