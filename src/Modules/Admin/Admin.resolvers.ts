import { AdminService } from "./Admin.services.js";

export const AdminResolver = {
    Query: {
        getAdminDetails: async (_: any, __: any, context: any) => {
            return AdminService.getAdminDetails(context.user);
        },
        getAllAdminUser: async (_: any, __: any, context: any) => {
            return AdminService.getAllAdminUser(context.user, __.search, __.page, __.limit);
        },
        getDashboardStats: async (_: any, __: any, context: any) => {
            return AdminService.getDashboardStats();
        }
    },
    Mutation: {
        registerAdmin: async (_: any, __: any, context: any) => {
            return AdminService.registerAdmin(__.input);
        },
        loginAdmin: async (_: any, __: any, context: any) => {
            return AdminService.loginAdmin(__.input);
        }
    }
};
