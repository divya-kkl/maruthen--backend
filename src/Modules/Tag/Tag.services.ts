import { tagModel } from "../../DB/MongoDB/Tag/Tag.js";

export const TagService = {
    async getAllTags(search?: string, page?: number, limit?: number) {
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
        
        let totalCount = await tagModel.countDocuments(filter);
        let query = tagModel.find(filter).sort({ createdTime: -1 });
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        const tags = await query;
        const tagsList = tags.map((tag) => ({
            id: tag._id,
            name: tag.name,
            code: tag.code,
            description: tag.description,
            status: tag.status,
            createdTime: tag.createdTime?.toString()
        }));

        return {
            tags: tagsList,
            totalCount
        };
    },

    async getTagById(id: string) {
        const tag = await tagModel.findById(id);
        if (!tag) {
            throw new Error("Tag not found");
        }
        return {
            id: tag._id,
            name: tag.name,
            code: tag.code,
            description: tag.description,
            status: tag.status,
            createdTime: tag.createdTime?.toString()
        };
    },

    async createTag(input: any) {
        const newTag = await tagModel.create(input);
        return {
            id: newTag._id,
            name: newTag.name,
            code: newTag.code,
            description: newTag.description,
            status: newTag.status,
            createdTime: newTag.createdTime?.toString()
        };
    },

    async updateTag(id: string, input: any) {
        const updatedTag = await tagModel.findByIdAndUpdate(id, input, { new: true });
        if (!updatedTag) {
            throw new Error("Tag not found");
        }
        return {
            id: updatedTag._id,
            name: updatedTag.name,
            code: updatedTag.code,
            description: updatedTag.description,
            status: updatedTag.status,
            createdTime: updatedTag.createdTime?.toString()
        };
    },

    async deleteTag(id: string) {
        const deletedTag = await tagModel.findByIdAndDelete(id);
        if (!deletedTag) {
            throw new Error("Tag not found");
        }
        return "Tag deleted successfully";
    }
};
