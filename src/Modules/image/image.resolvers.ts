import { ImageService } from "./image.services.js";

export const ImageResolver = {
    Query: {
        getAllImages: async () => {
            return ImageService.getAllImages();
        },
        getActiveImages: async () => {
            return ImageService.getActiveImages();
        },
        getImageById: async (_: any, { id }: any) => {
            return ImageService.getImageById(id);
        }
    },
    Mutation: {
        createImage: async (_: any, { input }: any) => {
            return ImageService.createImage(input);
        },
        updateImage: async (_: any, { id, input }: any) => {
            return ImageService.updateImage(id, input);
        },
        deleteImage: async (_: any, { id }: any) => {
            return ImageService.deleteImage(id);
        },
        toggleImageStatus: async (_: any, { id }: any) => {
            return ImageService.toggleImageStatus(id);
        }
    }
};
