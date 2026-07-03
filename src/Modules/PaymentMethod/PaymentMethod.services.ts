import { paymentMethodModel } from "../../DB/MongoDB/PaymentMethod/PaymentMethod.js";

const formatPaymentMethod = (pm: any) => ({
    id: pm._id,
    name: pm.name,
    value: pm.value,
    description: pm.description || "",
    icon: pm.icon || "💳",
    status: pm.status,
    sortOrder: pm.sortOrder ?? 0,
    createdAt: pm.createdAt?.toString(),
    updatedAt: pm.updatedAt?.toString()
});

export const PaymentMethodService = {

    async getAllPaymentMethods() {
        const methods = await paymentMethodModel.find().sort({ sortOrder: 1, createdAt: -1 });
        return methods.map(formatPaymentMethod);
    },

    async getActivePaymentMethods() {
        const methods = await paymentMethodModel.find({ status: "ACTIVE" }).sort({ sortOrder: 1, createdAt: 1 });
        return methods.map(formatPaymentMethod);
    },

    async getPaymentMethodById(id: string) {
        const pm = await paymentMethodModel.findById(id);
        if (!pm) throw new Error("Payment Method not found");
        return formatPaymentMethod(pm);
    },

    async createPaymentMethod(input: any) {
        const pm = await paymentMethodModel.create(input);
        return formatPaymentMethod(pm);
    },

    async updatePaymentMethod(id: string, input: any) {
        const pm = await paymentMethodModel.findByIdAndUpdate(id, input, { new: true });
        if (!pm) throw new Error("Payment Method not found");
        return formatPaymentMethod(pm);
    },

    async deletePaymentMethod(id: string) {
        const pm = await paymentMethodModel.findByIdAndDelete(id);
        if (!pm) throw new Error("Payment Method not found");
        return "Payment Method deleted successfully";
    }
};
