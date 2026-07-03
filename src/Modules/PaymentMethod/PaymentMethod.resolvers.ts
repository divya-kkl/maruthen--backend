import { PaymentMethodService } from "./PaymentMethod.services.js";

export const PaymentMethodResolver = {
    Query: {
        getAllPaymentMethods: async (_: any, __: any, context: any) => {
            return PaymentMethodService.getAllPaymentMethods();
        },
        getActivePaymentMethods: async (_: any, __: any, context: any) => {
            return PaymentMethodService.getActivePaymentMethods();
        },
        getPaymentMethodById: async (_: any, { id }: any, context: any) => {
            return PaymentMethodService.getPaymentMethodById(id);
        }
    },
    Mutation: {
        createPaymentMethod: async (_: any, { input }: any, context: any) => {
            return PaymentMethodService.createPaymentMethod(input);
        },
        updatePaymentMethod: async (_: any, { id, input }: any, context: any) => {
            return PaymentMethodService.updatePaymentMethod(id, input);
        },
        deletePaymentMethod: async (_: any, { id }: any, context: any) => {
            return PaymentMethodService.deletePaymentMethod(id);
        }
    }
};
