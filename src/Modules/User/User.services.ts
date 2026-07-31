import { userModel } from "../../DB/MongoDB/User/User.js";
import bcrypt from "bcryptjs";
import { signToken } from "../../helpers/validation.js";
import { SocketAddress } from "net";

export const UserService = {

    async getAllUsers(search?: string, page?: number, limit?: number) {
        let filter = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                $or: [
                    { username: { $regex: regex } },
                    { email: { $regex: regex } }
                ]
            };
        }
        
        let totalCount = await userModel.countDocuments(filter);
        let query = userModel.find(filter).sort({ createdTime: -1 });
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        
        const users = await query;
        const mappedUsers = users.map((item) => ({
            id: item._id,
            username: item.username,
            email: item.email,
            country: item.country,
            state: item.state,
            city: item.city,
            address: item.address,
            phone_number: item.phone_number,
            pincode: item.pincode,
            gender: item.gender,
            addresses: item.addresses,
            createdAt: item.createdTime?.toString()

        }));

        return {
            users: mappedUsers,
            totalCount
        };
    },



    async getUser(search?: string, page?: number, limit?: number) {
        return UserService.getAllUsers(search, page, limit);
    },

    async getUserById(id: string) {
        const item = await userModel.findById(id);
        if (!item) {
            throw new Error("User not found");
        }
        return {
            id: item._id,
            username: item.username,
            email: item.email,
            country: item.country,
            state: item.state,
            city: item.city,
            address: item.address,
            phone_number: item.phone_number,
            pincode: item.pincode,
            gender: item.gender,
            addresses: item.addresses,
            createdAt: item.createdTime?.toString()
        };
    },

    async register(input: any = {}) {

        const { username, email, country, state, city, address, phone_number, pincode, createdTime, gender, password } = input;

        if (!password) {
            throw new Error("Password is required");
        }
        if (!email) {
            throw new Error("Email is required");
        }
        if (pincode && typeof pincode !== 'number') {
            throw new Error("Pincode must be a number");
        }

        const exist = await userModel.findOne({ email });

        if (exist) {
            throw new Error("user Already exists with this email")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const initialAddress = {
            firstName: username,
            lastName: "",
            address: address || "",
            city: city || "",
            state: state || "",
            pincode: pincode || undefined,
            country: country || "",
            phone: phone_number || "",
            isDefault: true
        };

        const hasAddressInfo = address || city || state || pincode || country;

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            country,
            state,
            city,
            address,
            phone_number,
            pincode,
            gender,
            addresses: hasAddressInfo ? [initialAddress] : [],
            createdTime: new Date().toString(),
        });

        const token = signToken({ id: newUser._id, email: newUser.email });

        return {
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                country: newUser.country,
                state: newUser.state,
                city: newUser.city,
                address: newUser.address,
                phone_number: newUser.phone_number,
                pincode: newUser.pincode,
                gender: newUser.gender,
                addresses: newUser.addresses,
                createdTime: newUser.createdTime?.toString(),
            },
            token,
        };
    },

    async loginUser(input: any = {}) {
        const { email, password } = input;

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const user = await userModel.findOne({ email });

        if (!user || !user.password) {
            throw new Error("Invalid email or password");
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new Error("Invalid email or password")
        }

        const token = signToken({ id: user._id, email: user.email });
        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                country: user.country,
                state: user.state,
                city: user.city,
                address: user.address,
                phone_number: user.phone_number,
                pincode: user.pincode,
                gender: user.gender,
                addresses: user.addresses,
                createdTime: user.createdTime?.toString(),
            },
            token
        };

    },

    async updateUser(id: string, input: any) {
        const updatedUser = await userModel.findByIdAndUpdate(id, input, { new: true });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            country: updatedUser.country,
            state: updatedUser.state,
            city: updatedUser.city,
            address: updatedUser.address,
            phone_number: updatedUser.phone_number,
            pincode: updatedUser.pincode,
            gender: updatedUser.gender,
            addresses: updatedUser.addresses,
            createdTime: updatedUser.createdTime?.toString(),
        };
    },

    async deleteUser(id: string) {
        const deletedUser = await userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new Error("User not found");
        }
        return "User deleted successfully";
    }
}
