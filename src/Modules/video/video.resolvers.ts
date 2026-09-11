import { VideoService } from "./video.services.js";

export const VideoResolver = {
    Query: {
        getAllVideos: async () => {
            return VideoService.getAllVideos();
        },
        getActiveVideos: async () => {
            return VideoService.getActiveVideos();
        },
        getVideoById: async (_: any, { id }: any) => {
            return VideoService.getVideoById(id);
        }
    },
    Mutation: {
        createVideo: async (_: any, { input }: any) => {
            return VideoService.createVideo(input);
        },
        updateVideo: async (_: any, { id, input }: any) => {
            return VideoService.updateVideo(id, input);
        },
        deleteVideo: async (_: any, { id }: any) => {
            return VideoService.deleteVideo(id);
        },
        toggleVideoStatus: async (_: any, { id }: any) => {
            return VideoService.toggleVideoStatus(id);
        }
    }
};
