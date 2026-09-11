import { ImageModel } from "../../DB/MongoDB/image/image.js";

export const ImageService = {
    async getAllImages() {
        const images = await ImageModel.find().sort({ createdAt: -1 });
        return images.map((image: any) => ({
            id: image._id,
            title: image.title,
            description: image.description,
            imageUrl: image.imageUrl,
            isActive: image.isActive,
            createdAt: image.createdAt?.toString(),
            updatedAt: image.updatedAt?.toString()
        }));
    },

    async getActiveImages() {
        const images = await ImageModel.find({ isActive: true }).sort({ createdAt: -1 });
        return images.map((image: any) => ({
            id: image._id,
            title: image.title,
            description: image.description,
            imageUrl: image.imageUrl,
            isActive: image.isActive,
            createdAt: image.createdAt?.toString(),
            updatedAt: image.updatedAt?.toString()
        }));
    },

    async getImageById(id: string) {
        const image: any = await ImageModel.findById(id);
        if (!image) throw new Error("Image not found");
        return {
            id: image._id,
            title: image.title,
            description: image.description,
            imageUrl: image.imageUrl,
            isActive: image.isActive,
            createdAt: image.createdAt?.toString(),
            updatedAt: image.updatedAt?.toString()
        };
    },

    async createImage(input: any) {
        const image: any = await ImageModel.create(input);
        return {
            id: image._id,
            title: image.title,
            description: image.description,
            imageUrl: image.imageUrl,
            isActive: image.isActive,
            createdAt: image.createdAt?.toString(),
            updatedAt: image.updatedAt?.toString()
        };
    },

    async updateImage(id: string, input: any) {
        const image: any = await ImageModel.findByIdAndUpdate(
            id,
            { $set: input },
            { new: true }
        );
        if (!image) throw new Error("Image not found");
        return {
            id: image._id,
            title: image.title,
            description: image.description,
            imageUrl: image.imageUrl,
            isActive: image.isActive,
            createdAt: image.createdAt?.toString(),
            updatedAt: image.updatedAt?.toString()
        };
    },

    async deleteImage(id: string) {
        const deleted = await ImageModel.findByIdAndDelete(id);
        if (!deleted) throw new Error("Image not found");
        return "Image deleted successfully";
    },

    async toggleImageStatus(id: string) {
        const image: any = await ImageModel.findById(id);
        if (!image) throw new Error("Image not found");
        image.isActive = !image.isActive;
        await image.save();
        return {
            id: image._id,
            title: image.title,
            description: image.description,
            imageUrl: image.imageUrl,
            isActive: image.isActive,
            createdAt: image.createdAt?.toString(),
            updatedAt: image.updatedAt?.toString()
        };
    }
};
