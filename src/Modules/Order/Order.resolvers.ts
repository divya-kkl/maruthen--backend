import { OrderService } from "./Order.services.js";

export const OrderResolver = {
    Query: {
        getAllOrders: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return OrderService.getAllOrders(__.search, __.page, __.limit);
        },

        getOrderById: async (_: any, { id }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return OrderService.getOrderById(id);
        },
        getOrder: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return OrderService.getAllOrders(__.search, __.page, __.limit);
        },
        getUserAddresses: async (_: any, __: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return OrderService.getUserAddresses(context);
        }
    },
    Mutation: {
        placeOrder: async (_: any, { input }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return OrderService.placeOrder(input, context);
        },
        updateOrderStatus: async (_: any, { id, status, image }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return OrderService.updateOrderStatus(id, status, image);
        },
        deleteOrder: async (_: any, { id }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return OrderService.deleteOrder(id);
        },
        createRazorpayOrder: async (_: any, { amount }: any, context: any) => {
            if (!context.user) throw new Error("Unauthorized: Bearer token is missing or invalid");
            return OrderService.createRazorpayOrder(amount);
        }
    }
};
