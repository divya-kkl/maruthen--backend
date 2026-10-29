
import { UserAddressServices } from "./UserAddress.services.js";

export const userAddressResolver = {
  Query: {
    getMyAddresses: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      return UserAddressServices.getMyAddresses(context.user.userId);
    },
    getAllUserAddress: async (_: any, { userId }: { userId?: string }, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      const targetId = userId || context.user.userId;
      return UserAddressServices.getAllUserAddress(targetId);
    },
  },

  Mutation: {
    addUserAddress: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      return UserAddressServices.addUserAddress(context.user.userId, input);
    },
    updateUserAddress: async (_: any, { addressId, input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      return UserAddressServices.updateUserAddress(context.user.userId, addressId, input);
    },
    deleteUserAddress: async (_: any, { addressId }: { addressId: string }, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      return UserAddressServices.deleteUserAddress(context.user.userId, addressId);
    },
    setDefaultAddress: async (_: any, { addressId }: { addressId: string }, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      return UserAddressServices.setDefaultAddress(context.user.userId, addressId);
    },
  },
};
