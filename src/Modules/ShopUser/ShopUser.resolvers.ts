import { ShopUserService } from "./ShopUser.services.js";

export const ShopUserResolver = {
    Query: {
        getAllShopUsers: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ShopUserService.getAllShopUsers(context.user, __.search, __.page, __.limit);
        },
        getAllShopUsersPaginated: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ShopUserService.getAllShopUsersPaginated(context.user, __.search, __.page, __.limit);
        },
        getShopUserById: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ShopUserService.getShopUserById(__.id, context.user);
        },
        getShopUser: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ShopUserService.getAllShopUsers(context.user, __.search, __.page, __.limit);
        }
    },
    Mutation: {
        registerShopUser: async (_: any, __: any, context: any) => {
            return ShopUserService.registerShopUser(__.input);
        },
        loginShopUser: async (_: any, __: any, context: any) => {
            return ShopUserService.loginShopUser(__.input);
        },
        updateShopUser: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ShopUserService.updateShopUser(__.id, __.input, context.user);
        },
        deleteShopUser: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return ShopUserService.deleteShopUser(__.id, context.user);
        }
    }
};
