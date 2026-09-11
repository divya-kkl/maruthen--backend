import { VideoModel } from "../../DB/MongoDB/video/video.js";

export const VideoService = {
    async getAllVideos() {
        const videos = await VideoModel.find().sort({ createdAt: -1 });
        return videos.map((video: any) => ({
            id: video._id,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            isActive: video.isActive,
            createdAt: video.createdAt?.toString(),
            updatedAt: video.updatedAt?.toString()
        }));
    },

    async getActiveVideos() {
        const videos = await VideoModel.find({ isActive: true }).sort({ createdAt: -1 });
        return videos.map((video: any) => ({
            id: video._id,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            isActive: video.isActive,
            createdAt: video.createdAt?.toString(),
            updatedAt: video.updatedAt?.toString()
        }));
    },

    async getVideoById(id: string) {
        const video: any = await VideoModel.findById(id);
        if (!video) throw new Error("Video not found");
        return {
            id: video._id,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            isActive: video.isActive,
            createdAt: video.createdAt?.toString(),
            updatedAt: video.updatedAt?.toString()
        };
    },

    async createVideo(input: any) {
        const video: any = await VideoModel.create(input);
        return {
            id: video._id,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            isActive: video.isActive,
            createdAt: video.createdAt?.toString(),
            updatedAt: video.updatedAt?.toString()
        };
    },

    async updateVideo(id: string, input: any) {
        const video: any = await VideoModel.findByIdAndUpdate(
            id,
            { $set: input },
            { new: true }
        );
        if (!video) throw new Error("Video not found");
        return {
            id: video._id,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            isActive: video.isActive,
            createdAt: video.createdAt?.toString(),
            updatedAt: video.updatedAt?.toString()
        };
    },

    async deleteVideo(id: string) {
        const deleted = await VideoModel.findByIdAndDelete(id);
        if (!deleted) throw new Error("Video not found");
        return "Video deleted successfully";
    },

    async toggleVideoStatus(id: string) {
        const video: any = await VideoModel.findById(id);
        if (!video) throw new Error("Video not found");
        video.isActive = !video.isActive;
        await video.save();
        return {
            id: video._id,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            isActive: video.isActive,
            createdAt: video.createdAt?.toString(),
            updatedAt: video.updatedAt?.toString()
        };
    }
};
