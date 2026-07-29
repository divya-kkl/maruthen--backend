import { productCategoryMOdel } from "../../DB/MongoDB/ProductCategories/ProductCategories.js";

export const ProductCategoryService = {
    async getAllProductCategories(search?: string, page?: number, limit?: number, status?: string) {
        let filter: any = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                $or: [
                    { name: { $regex: regex } },
                    { code: { $regex: regex } }
                ]
            };
        }

        if (status) {
            filter.status = status;
        }

        let totalCount = await productCategoryMOdel.countDocuments(filter);
        let query = productCategoryMOdel.find(filter).sort({ createdTime: -1 });
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        const categories = await query;
        const categoriesList = categories.map((category) => ({
            id: category._id,
            name: category.name,
            code: category.code,
            description: category.description,
            imageUrl: category.imageUrl,
            status: category.status,
            parentCategoryId: category.parentCategoryId?.toString(),
            createdTime: category.createdTime?.toString()
        }));

        return {
            categories: categoriesList,
            totalCount
        };
    },



    async getProductCategories(search?: string, page?: number, limit?: number) {
        return ProductCategoryService.getAllProductCategories(search, page, limit, "ACTIVE");
    },

    async getProductCategoryById(id: string) {
        const category = await productCategoryMOdel.findById(id);
        if (!category) {
            throw new Error("Product Category not found");
        }
        return {
            id: category._id,
            name: category.name,
            code: category.code,
            description: category.description,
            imageUrl: category.imageUrl,
            status: category.status,
            parentCategoryId: category.parentCategoryId?.toString(),
            createdTime: category.createdTime?.toString()
        };
    },

    async createProductCategory(input: any) {
        const newCategory = await productCategoryMOdel.create(input);
        return {
            id: newCategory._id,
            name: newCategory.name,
            code: newCategory.code,
            description: newCategory.description,
            imageUrl: newCategory.imageUrl,
            status: newCategory.status,
            parentCategoryId: newCategory.parentCategoryId?.toString(),
            createdTime: newCategory.createdTime?.toString()
        };
    },

    async updateProductCategory(id: string, input: any) {
        const updatedCategory = await productCategoryMOdel.findByIdAndUpdate(id, input, { new: true });
        if (!updatedCategory) {
            throw new Error("Product Category not found");
        }
        return {
            id: updatedCategory._id,
            name: updatedCategory.name,
            code: updatedCategory.code,
            description: updatedCategory.description,
            imageUrl: updatedCategory.imageUrl,
            status: updatedCategory.status,
            parentCategoryId: updatedCategory.parentCategoryId?.toString(),
            createdTime: updatedCategory.createdTime?.toString()
        };
    },

    async deleteProductCategory(id: string) {
        // Check if any products are associated with this category
        const { productModel } = await import("../../DB/MongoDB/Product/Product.js");
        const productsCount = await productModel.countDocuments({
            productCategoriesID: id
        });

        if (productsCount > 0) {
            throw new Error("Cannot delete category. Please delete all products associated with this category first.");
        }

        const deletedCategory = await productCategoryMOdel.findByIdAndDelete(id);
        if (!deletedCategory) {
            throw new Error("Product Category not found");
        }
        return "Product Category deleted successfully";
    }
};
