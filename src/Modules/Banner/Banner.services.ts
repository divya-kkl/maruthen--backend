import { BannerModel } from "../../DB/MongoDB/Banner/Banner.js";

export const BannerService = {
    async getAllBanners(bannerType?: string) {
        const query = bannerType ? { bannerType } : {};
        const banners = await BannerModel.find(query).sort({ createdAt: -1 });
        return banners.map((banner: any) => ({
            id: banner._id,
            backgroundImages: banner.backgroundImages || [],
            sideImage: banner.sideImage,
            sideContent: banner.sideContent,
            bannerType: banner.bannerType,
            isActive: banner.isActive,
            fontColor: banner.fontColor,
            fontSize: banner.fontSize,
            buttonColor: banner.buttonColor,
            buttonSize: banner.buttonSize,
            contentPosition: banner.contentPosition,
            imagePosition: banner.imagePosition,
            createdAt: banner.createdAt?.toString(),
            updatedAt: banner.updatedAt?.toString()
        }));
    },

    async getActiveBanners(bannerType?: string) {
        const query: any = { isActive: true };
        if (bannerType) query.bannerType = bannerType;
        const banners = await BannerModel.find(query).sort({ createdAt: -1 });
        return banners.map((banner: any) => ({
            id: banner._id,
            backgroundImages: banner.backgroundImages || [],
            sideImage: banner.sideImage,
            sideContent: banner.sideContent,
            bannerType: banner.bannerType,
            isActive: banner.isActive,
            fontColor: banner.fontColor,
            fontSize: banner.fontSize,
            buttonColor: banner.buttonColor,
            buttonSize: banner.buttonSize,
            contentPosition: banner.contentPosition,
            imagePosition: banner.imagePosition,
            createdAt: banner.createdAt?.toString(),
            updatedAt: banner.updatedAt?.toString()
        }));
    },

    async getBannerById(id: string) {
        const banner: any = await BannerModel.findById(id);
        if (!banner) throw new Error("Banner not found");
        return {
            id: banner._id,
            backgroundImages: banner.backgroundImages || [],
            sideImage: banner.sideImage,
            sideContent: banner.sideContent,
            bannerType: banner.bannerType,
            isActive: banner.isActive,
            fontColor: banner.fontColor,
            fontSize: banner.fontSize,
            buttonColor: banner.buttonColor,
            buttonSize: banner.buttonSize,
            contentPosition: banner.contentPosition,
            imagePosition: banner.imagePosition,
            createdAt: banner.createdAt?.toString(),
            updatedAt: banner.updatedAt?.toString()
        };
    },

    async createBanner(input: any) {
        const newBanner: any = await BannerModel.create(input);
        return {
            id: newBanner._id,
            backgroundImages: newBanner.backgroundImages || [],
            sideImage: newBanner.sideImage,
            sideContent: newBanner.sideContent,
            bannerType: newBanner.bannerType,
            isActive: newBanner.isActive,
            fontColor: newBanner.fontColor,
            fontSize: newBanner.fontSize,
            buttonColor: newBanner.buttonColor,
            buttonSize: newBanner.buttonSize,
            contentPosition: newBanner.contentPosition,
            imagePosition: newBanner.imagePosition,
            createdAt: newBanner.createdAt?.toString(),
            updatedAt: newBanner.updatedAt?.toString()
        };
    },

    async updateBanner(id: string, input: any) {
        const updatedBanner: any = await BannerModel.findByIdAndUpdate(
            id,
            { $set: input },
            { new: true }
        );
        if (!updatedBanner) throw new Error("Banner not found");
        return {
            id: updatedBanner._id,
            backgroundImages: updatedBanner.backgroundImages || [],
            sideImage: updatedBanner.sideImage,
            sideContent: updatedBanner.sideContent,
            bannerType: updatedBanner.bannerType,
            isActive: updatedBanner.isActive,
            fontColor: updatedBanner.fontColor,
            fontSize: updatedBanner.fontSize,
            buttonColor: updatedBanner.buttonColor,
            buttonSize: updatedBanner.buttonSize,
            contentPosition: updatedBanner.contentPosition,
            imagePosition: updatedBanner.imagePosition,
            createdAt: updatedBanner.createdAt?.toString(),
            updatedAt: updatedBanner.updatedAt?.toString()
        };
    },

    async deleteBanner(id: string) {
        const deleted = await BannerModel.findByIdAndDelete(id);
        if (!deleted) throw new Error("Banner not found");
        return "Banner deleted successfully";
    }
};
