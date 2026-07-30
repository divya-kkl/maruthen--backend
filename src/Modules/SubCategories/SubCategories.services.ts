import { subCategoryModel } from "../../DB/MongoDB/SubCategories/SubCategories.js";

export const SubCategoryService = {
    async getAllSubCategories(search?: string, page?: number, limit?: number, status?: string) {
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

        let query = subCategoryModel.find(filter);
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        const categories = await query;
        return categories.map((category) => ({
            id: category._id,
            name: category.name,
            code: category.code,
            productCategoryId: category.productCategoryId?.toString(),
            description: category.description,
            imageUrl: category.imageUrl,
            status: category.status,
            createdTime: category.createdTime?.toString()
        }));
    },

    async getSubCategory(search?: string, page?: number, limit?: number) {
        return SubCategoryService.getAllSubCategories(search, page, limit, "ACTIVE");
    },

    async getSubCategoryById(id: string) {
        const category = await subCategoryModel.findById(id);
        if (!category) {
            throw new Error("Sub Category not found");
        }
        return {
            id: category._id,
            name: category.name,
            code: category.code,
            productCategoryId: category.productCategoryId?.toString(),
            description: category.description,
            imageUrl: category.imageUrl,
            status: category.status,
            createdTime: category.createdTime?.toString()
        };
    },

    async createSubCategory(input: any) {
        const newCategory = await subCategoryModel.create(input);
        return {
            id: newCategory._id,
            name: newCategory.name,
            code: newCategory.code,
            productCategoryId: newCategory.productCategoryId?.toString(),
            description: newCategory.description,
            imageUrl: newCategory.imageUrl,
            status: newCategory.status,
            createdTime: newCategory.createdTime?.toString()
        };
    },

    async updateSubCategory(id: string, input: any) {
        const updatedCategory = await subCategoryModel.findByIdAndUpdate(id, input, { new: true });
        if (!updatedCategory) {
            throw new Error("Sub Category not found");
        }
        return {
            id: updatedCategory._id,
            name: updatedCategory.name,
            code: updatedCategory.code,
            productCategoryId: updatedCategory.productCategoryId?.toString(),
            description: updatedCategory.description,
            imageUrl: updatedCategory.imageUrl,
            status: updatedCategory.status,
            createdTime: updatedCategory.createdTime?.toString()
        };
    },

    async deleteSubCategory(id: string) {
        const deletedCategory = await subCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            throw new Error("Sub Category not found");
        }
        return "Sub Category deleted successfully";
    }
};
