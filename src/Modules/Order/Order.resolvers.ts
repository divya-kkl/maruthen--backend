import { OrderService } from "./Order.services.js";

export const OrderResolver = {
    Query: {
        getAllOrders: async (_: any, __: any, context: any) => {
            return OrderService.getAllOrders(__.search, __.page, __.limit);
        },

        getOrderById: async (_: any, { id }: any, context: any) => {
            return OrderService.getOrderById(id);
        },
        getOrder: async (_: any, __: any, context: any) => {
            return OrderService.getAllOrders(__.search, __.page, __.limit);
        },
        getUserAddresses: async (_: any, __: any, context: any) => {
            return OrderService.getUserAddresses(context);
        }
    },
    Mutation: {
        placeOrder: async (_: any, { input }: any, context: any) => {
            return OrderService.placeOrder(input, context);
        },
        updateOrderStatus: async (_: any, { id, status, image }: any, context: any) => {
            return OrderService.updateOrderStatus(id, status, image);
        },
        deleteOrder: async (_: any, { id }: any, context: any) => {
            return OrderService.deleteOrder(id);
        },
        createRazorpayOrder: async (_: any, { amount }: any, context: any) => {
            return OrderService.createRazorpayOrder(amount);
        }
    }
};
