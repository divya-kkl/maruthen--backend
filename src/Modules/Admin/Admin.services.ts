import { adminModel } from "../../DB/MongoDB/Admin/Admin.js";
import bcrypt from "bcryptjs";
import { signToken } from "../../helpers/validation.js";

export const AdminService = {
    async getAllAdminUser(user: any, search?: string, page?: number, limit?: number) {
        if (!user || user.role !== 'admin') {
            throw new Error("Unauthorized");
        }
        let filter: any = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                $or: [
                    { username: { $regex: regex } },
                    { email: { $regex: regex } }
                ]
            };
        }
        
        let query = adminModel.find(filter);
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        
        const admins = await query;
        return admins.map(item => ({
            id: item._id,
            username: item.username,
            email: item.email,
            mobile: item.mobile,
            gender: item.gender,
            role: item.role,
            createdTime: item.createdTime?.toString()
        }));
    },

    async getAdminDetails(user: any) {
        if (!user || user.role !== 'admin') {
            throw new Error("Unauthorized");
        }
        const item = await adminModel.findById(user.id);
        if (!item) {
            throw new Error("Admin not found");
        }
        return {
            id: item._id,
            username: item.username,
            email: item.email,
            mobile: item.mobile,
            gender: item.gender,
            role: item.role,
            createdTime: item.createdTime?.toString()
        };
    }, 

    async registerAdmin(input: any = {}) {
        const { username, email, password, mobile, gender } = input;

        if (!password) {
            throw new Error("Password is required");
        }
        if (!email) {
            throw new Error("Email is required");
        }
        if (!username) {
            throw new Error("Username is required");
        }
        if (!mobile) {
            throw new Error("Mobile number is required");
        }
        if (!gender) {
            throw new Error("Gender is required");
        }

        const exist = await adminModel.findOne({ email });
        if (exist) {
            throw new Error("Admin already exists with this email");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await adminModel.create({
            username,
            email,
            password: hashedPassword,
            mobile,
            gender,
            role: 'admin',
            createdTime: new Date()
        });

        const token = signToken({ id: newAdmin._id, email: newAdmin.email, role: 'admin' });

        return {
            user: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email,
                mobile: newAdmin.mobile,
                gender: newAdmin.gender,
                role: newAdmin.role,
                createdTime: newAdmin.createdTime?.toString(),
            },
            jwtToken: token,
        };
    },

    async loginAdmin(input: any = {}) {
        const { email, password } = input;

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const user = await adminModel.findOne({ email });

        if (!user || !user.password) {
            throw new Error("Invalid email or password");
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new Error("Invalid email or password");
        }

        const token = signToken({ id: user._id, email: user.email, role: 'admin' });

        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender,
                role: user.role,
                createdTime: user.createdTime?.toString(),
            },
            jwtToken: token
        };
    },

    async getDashboardStats() {
        const { productModel } = await import("../../DB/MongoDB/Product/Product.js");
        const { OrderModel } = await import("../../DB/MongoDB/Order/Order.js");
        const { userModel } = await import("../../DB/MongoDB/User/User.js");
        const { productCategoryMOdel } = await import("../../DB/MongoDB/ProductCategories/ProductCategories.js");
        const { subCategoryModel } = await import("../../DB/MongoDB/SubCategories/SubCategories.js");
        const { cartModel } = await import("../../DB/MongoDB/Cart/Cart.js");

        const [totalOrders, totalUsers, totalProducts, totalCategories, totalSubCategories, totalCarts] =
            await Promise.all([
                OrderModel.countDocuments(),
                userModel.countDocuments(),
                productModel.countDocuments(),
                productCategoryMOdel.countDocuments(),
                subCategoryModel.countDocuments(),
                cartModel.countDocuments()
            ]);

        return {
            totalOrders,
            totalUsers,
            totalProducts,
            totalCategories,
            totalSubCategories,
            totalCarts
        };
    }
};
