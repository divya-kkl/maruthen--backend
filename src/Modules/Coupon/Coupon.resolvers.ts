import { CouponService } from "./Coupon.services.js";

export const CouponResolver = {
    Query: {
        getAllCoupons: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return CouponService.getAllCoupons(__.search, __.page, __.limit);
        },
        getCouponById: async (_: any, { id }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return CouponService.getCouponById(id);
        },
        getCoupon: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return CouponService.getAllCoupons(__.search, __.page, __.limit);
        },
        getCouponByCode: async (_: any, { code }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return CouponService.getCouponByCode(code);
        }
    },
    Mutation: {
        createCoupon: async (_: any, { input }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return CouponService.createCoupon(input);
        },
        updateCoupon: async (_: any, { id, input }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return CouponService.updateCoupon(id, input);
        },
        deleteCoupon: async (_: any, { id }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return CouponService.deleteCoupon(id);
        },
        incrementCouponUses: async (_: any, { id }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return CouponService.incrementCouponUses(id);
        }
    }
};
