import { CouponService } from "./Coupon.services.js";

export const CouponResolver = {
    Query: {
        getAllCoupons: async (_: any, __: any, context: any) => {
            return CouponService.getAllCoupons(__.search, __.page, __.limit);
        },
        getCouponById: async (_: any, { id }: any) => {
            return CouponService.getCouponById(id);
        },
        getCoupon: async (_: any, __: any, context: any) => {
            return CouponService.getAllCoupons(__.search, __.page, __.limit);
        },
        getCouponByCode: async (_: any, { code }: any) => {
            return CouponService.getCouponByCode(code);
        }
    },
    Mutation: {
        createCoupon: async (_: any, { input }: any) => {
            return CouponService.createCoupon(input);
        },
        updateCoupon: async (_: any, { id, input }: any) => {
            return CouponService.updateCoupon(id, input);
        },
        deleteCoupon: async (_: any, { id }: any) => {
            return CouponService.deleteCoupon(id);
        },
        incrementCouponUses: async (_: any, { id }: any) => {
            return CouponService.incrementCouponUses(id);
        }
    }
};
