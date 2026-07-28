import { TagService } from "./Tag.services.js";

export const TagResolver = {
    Query: {
        getAllTags: async (_: any, __: any, context: any) => {
            return TagService.getAllTags(__.search, __.page, __.limit);
        },

        getTagById: async (_: any, { id }: any, context: any) => {
            return TagService.getTagById(id);
        }
    },
    Mutation: {
        createTag: async (_: any, __: any, context: any) => {
            return TagService.createTag(__.input);
        },
        updateTag: async (_: any, __: any, context: any) => {
            return TagService.updateTag(__.id, __.input);
        },
        deleteTag: async (_: any, __: any, context: any) => {
            return TagService.deleteTag(__.id);
        }
    }
};
