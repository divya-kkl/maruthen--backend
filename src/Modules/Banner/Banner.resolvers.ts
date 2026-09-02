import { BannerService } from "./Banner.services.js";

export const BannerResolver = {
    Query: {
        getAllBanners: async (_: any, { bannerType }: any, context: any) => {
            return BannerService.getAllBanners(bannerType);
        },
        getActiveBanners: async (_: any, { bannerType }: any, context: any) => {
            return BannerService.getActiveBanners(bannerType);
        },
        getBannerById: async (_: any, { id }: any, context: any) => {
            return BannerService.getBannerById(id);
        }
    },
    Mutation: {
        createBanner: async (_: any, input: any, context: any) => {
            return BannerService.createBanner(input);
        },
        updateBanner: async (_: any, { id, input }: any, context: any) => {
            return BannerService.updateBanner(id, input);
        },
        deleteBanner: async (_: any, { id }: any, context: any) => {
            return BannerService.deleteBanner(id);
        }
    }
};
