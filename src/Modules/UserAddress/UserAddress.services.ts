import { UserAddressModel } from "../../DB/MongoDB/UserAddress/UserAddress.js";
import { userModel } from "../../DB/MongoDB/User/User.js";

function formatAddress(addr: any) {
    const obj = addr.toObject ? addr.toObject() : addr;
    return {
        ...obj,
        id: (obj._id || obj.id)?.toString(),
        userId: obj.userId?.toString(),
        createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : "",
        updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : "",
    };
}

export const UserAddressServices = {
    async getMyAddresses(userId: string) {
        const addresses = await UserAddressModel.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
        return addresses.map((addr: any) => formatAddress(addr));
    },

    async getAllUserAddress(userId: string) {
        const addresses = await UserAddressModel.find({ userId }).sort({ createdAt: -1 });
        return addresses.map((addr: any) => formatAddress(addr));
    },

    async addUserAddress(userId: string, input: any) {
        const count = await UserAddressModel.countDocuments({ userId });

        let isDefault = input.isDefault;
        if (isDefault || count === 0) {
            isDefault = true;
            await UserAddressModel.updateMany({ userId }, { isDefault: false });
        }

        const address: any = await UserAddressModel.create({
            userId,
            ...input,
            isDefault,
        });

        if (address.isDefault) {
            await userModel.findByIdAndUpdate(userId, {
                address: address.address ,
                city: address.city ,
                state: address.state ,
                pincode: address.pincode,
                country: address.country ,
            });
        }

        return formatAddress(address);
    },

    async updateUserAddress(userId: string, addressId: string, input: any) {
        const address = await UserAddressModel.findOne({ _id: addressId, userId });
        if (!address) throw new Error("Address not found");

        if (input.isDefault && !address.isDefault) {
            await UserAddressModel.updateMany({ userId }, { isDefault: false });
        }

        Object.assign(address, input);
        await address.save();

        if (address.isDefault) {
            await userModel.findByIdAndUpdate(userId, {
                address: address.address ,
                city: address.city ,
                state: address.state ,
                pincode: address.pincode,
                country: address.country ,
            });
        }

        return formatAddress(address);
    },

    async deleteUserAddress(userId: string, addressId: string) {
        const address: any = await UserAddressModel.findOne({ _id: addressId, userId });
        if (!address) throw new Error("Address not found");

        const wasDefault = address.isDefault;

        await UserAddressModel.deleteOne({ _id: addressId, userId });

        if (wasDefault) {
            const nextDefault: any = await UserAddressModel.findOne({ userId }).sort({ createdAt: -1 });
            if (nextDefault) {
                nextDefault.isDefault = true;
                await nextDefault.save();

                await userModel.findByIdAndUpdate(userId, {
                    address: nextDefault.address || "",
                    city: nextDefault.city || "",
                    state: nextDefault.state || "",
                    pincode: nextDefault.pincode,
                    country: nextDefault.country || "",
                });
            } else {
                await userModel.findByIdAndUpdate(userId, {
                    address: "",
                    city: "",
                    state: "",
                    pincode: null,
                    country: "",
                });
            }
        }
        return true;
    },

    async setDefaultAddress(userId: string, addressId: string) {
        const address: any = await UserAddressModel.findOne({ _id: addressId, userId });
        if (!address) throw new Error("Address not found");

        await UserAddressModel.updateMany({ userId }, { isDefault: false });
        address.isDefault = true;
        await address.save();

        await userModel.findByIdAndUpdate(userId, {
            address: address.address || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.pincode,
            country: address.country || "",
        });

        return formatAddress(address);
    },
};