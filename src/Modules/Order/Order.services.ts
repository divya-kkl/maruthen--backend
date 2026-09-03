import { OrderModel } from "../../DB/MongoDB/Order/Order.js";
import { cartModel } from "../../DB/MongoDB/Cart/Cart.js";
import { productModel } from "../../DB/MongoDB/Product/Product.js";
import { userModel } from "../../DB/MongoDB/User/User.js";
import { couponModel } from "../../DB/MongoDB/Coupon/Coupon.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { sendEmail } from "../../helpers/resend.js";

export const OrderService = {
    async getAllOrders(search?: string, page?: number, limit?: number) {
        let filter: any = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                $or: [
                    { orderNumber: { $regex: regex } },
                    { status: { $regex: regex } }
                ]
            };
            if (mongoose.Types.ObjectId.isValid(search)) {
                filter.$or.push({ userId: search });
            }
        }
        let totalCount = await OrderModel.countDocuments(filter);
        let query = OrderModel.find(filter).populate("shopDetails").sort({ createdAt: -1 });
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        const ordersResult = await query;
        const orders = ordersResult
            .filter((item: any) => item.userId && item.orderNumber && item.createdAt)
            .map((item: any) => ({
                id: item._id,
                userId: item.userId?.toString(),
                shopDetails: item.shopDetails,
                orderNumber: item.orderNumber,
                items: item.items,
                subTotal: item.subTotal,
                deliveryCharge: item.deliveryCharge,
                totalAmount: item.totalAmount,
                status: item.status,
                paymentStatus: item.paymentStatus,
                paymentMethod: item.paymentMethod,
                deliveryAddress: item.deliveryAddress,
                notes: item.notes,
                image: item.image,
                couponCode: item.couponCode,
                isCouponApplied: item.isCouponApplied,
                deliveryPartner: item.deliveryPartner,
                createdAt: item.createdAt?.toString(),
                updatedAt: item.updatedAt?.toString(),
            }));

        return {
            orders,
            totalCount
        };
    },

    async getOrder(search?: string, page?: number, limit?: number) {
        return OrderService.getAllOrders(search, page, limit);
    },

    async getUserAddresses(context: any) {
        if (!context || !context.user || !context.user.id) {
            throw new Error("Unauthorized: Please login to get addresses");
        }
        const userId = context.user.id;

        const user = await userModel.findById(userId);
        const addresses: any[] = [];

        if (user && user.addresses && user.addresses.length > 0) {
            for (const addr of user.addresses) {
                addresses.push({
                    addressType: addr.isDefault ? "Home" : "Other",
                    name: `${addr.firstName || ''} ${addr.lastName || ''}`.trim(),
                    street: `${addr.address || ''} ${addr.apartment || ''}`.trim(),
                    city: addr.city || '',
                    state: addr.state || '',
                    country: addr.country || '',
                    phone: addr.phone || ''
                });
            }
            return addresses;
        }

        const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
        const seen = new Set();

        for (const order of orders) {
            if (order.deliveryAddress) {
                const addr = order.deliveryAddress;
                const key = `${addr.name}-${addr.phone}-${addr.street}-${addr.city}-${addr.state}-${addr.country}-${addr.addressType}`.toLowerCase();
                if (!seen.has(key)) {
                    seen.add(key);
                    addresses.push(addr);
                }
            }
        }

        return addresses;
    },

    async getOrderById(id: string) {
        const item: any = await OrderModel.findById(id).populate("shopDetails");
        if (!item) {
            throw new Error("Order not found");
        }
        return {
            id: item._id,
            userId: item.userId,
            shopDetails: item.shopDetails,
            orderNumber: item.orderNumber,
            items: item.items,
            subTotal: item.subTotal,
            deliveryCharge: item.deliveryCharge,
            totalAmount: item.totalAmount,
            status: item.status,
            paymentStatus: item.paymentStatus,
            paymentMethod: item.paymentMethod,
            deliveryAddress: item.deliveryAddress,
            notes: item.notes,
            image: item.image,
            couponCode: item.couponCode,
            isCouponApplied: item.isCouponApplied,
            deliveryPartner: item.deliveryPartner,
            createdAt: item.createdAt?.toString(),
            updatedAt: item.updatedAt?.toString(),
        };
    },

    async placeOrder(input: any, context: any) {
        let userId;

        if (input.email) {
            console.log("Guest checkout with email:", input.email);
            let user = await userModel.findOne({ email: input.email });
            if (!user) {
                console.log("User not found, creating new user for:", input.email);
                const nameParts = input.deliveryAddress?.name ? input.deliveryAddress.name.split(" ") : [];
                const firstName = nameParts.length > 0 ? nameParts[0] : "";
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
                
                const randomPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                const initialAddress: any = {
                    firstName,
                    lastName,
                    address: input.deliveryAddress?.street || "",
                    city: input.deliveryAddress?.city || "",
                    state: input.deliveryAddress?.state || "",
                    pincode: input.deliveryAddress?.pincode ? parseInt(input.deliveryAddress.pincode) : undefined,
                    country: input.deliveryAddress?.country || "India",
                    phone: input.deliveryAddress?.phone || "",
                    isDefault: true
                };

                user = await userModel.create({
                    username: input.deliveryAddress?.name || input.email.split('@')[0] + Math.floor(Math.random() * 1000),
                    email: input.email,
                    password: hashedPassword,
                    phone_number: input.deliveryAddress?.phone || "",
                    address: input.deliveryAddress?.street || "",
                    city: input.deliveryAddress?.city || "",
                    state: input.deliveryAddress?.state || "",
                    country: input.deliveryAddress?.country || "India",
                    pincode: input.deliveryAddress?.pincode ? parseInt(input.deliveryAddress.pincode) : 0,
                    gender: "OTHER",
                    addresses: [initialAddress]
                });
                console.log("New user created successfully with ID:", user._id);
            } else {
                console.log("Existing user found with ID:", user._id);
            }
            userId = user._id;
        } else if (context && context.user && context.user.id) {
            userId = context.user.id;
        } else {
            throw new Error("Unauthorized: Please login or provide an email to place an order");
        }

        let subTotal = 0;
        const items = [];
        let cart = null;

        if (input.guestCartItems && input.guestCartItems.length > 0) {
            for (const item of input.guestCartItems) {
                const product = await productModel.findById(item.productId);
                if (!product) {
                    throw new Error(`Product not found for id: ${item.productId}`);
                }
                subTotal += product.price * item.quantity;
                items.push({
                    productId: product._id,
                    quantity: item.quantity,
                    price: product.price,
                    mrp: product.mrp,
                    name: product.name,
                    image: product.images?.[0] || "no-image-available",
                    size: item.size || "Default"
                });
            }
        } else {
            cart = await cartModel.findOne({ userId, status: "ACTIVE" });
            if (!cart || !cart.products || cart.products.length === 0) {
                throw new Error("Cart is empty");
            }

            for (const cartProduct of cart.products) {
                const product = await productModel.findById(cartProduct.productId);
                if (!product) {
                    throw new Error(`Product not found for id: ${cartProduct.productId}`);
                }

                subTotal += product.price * cartProduct.quantity;
                items.push({
                    productId: product._id,
                    quantity: cartProduct.quantity,
                    price: product.price,
                    mrp: product.mrp,
                    name: product.name,
                    image: product.images?.[0] || "no-image-available",
                    size: cartProduct.size || "Default"
                });
            }
        }

        let discountAmount = 0;
        let isCouponApplied = false;

        if (input.couponCode) {
            const coupon = await couponModel.findOne({ code: input.couponCode });
            if (coupon && coupon.isActive) {
                if (coupon.type === "PERCENTAGE") {
                    discountAmount = subTotal * (coupon.value / 100);
                } else {
                    discountAmount = coupon.value;
                }
                isCouponApplied = true;
            }
        }

        const totalAmount = Math.max(0, subTotal + (input.deliveryCharge || 0) - discountAmount);
        const orderNumber = "ORD" + Date.now().toString() + Math.floor(Math.random() * 1000).toString();

        let paymentStatus = "PENDING";

        if (input.paymentMethod === "RAZORPAY") {
            const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

            if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
                const crypto = await import("crypto");
                const body = razorpayOrderId + "|" + razorpayPaymentId;
                const expectedSignature = crypto
                    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
                    .update(body.toString())
                    .digest("hex");

                if (expectedSignature === razorpaySignature) {
                    paymentStatus = "PAID";
                } else {
                    paymentStatus = "FAILED";
                }
            }
        }

        const orderData = {
            ...input,
            userId,
            items,
            subTotal,
            totalAmount,
            orderNumber,
            paymentStatus,
            couponCode: isCouponApplied ? input.couponCode : undefined,
            isCouponApplied
        };

        const newOrder: any = await OrderModel.create(orderData);
        const populatedOrder: any = await OrderModel.findById(newOrder._id).populate("shopDetails");

        try {
            const user = await userModel.findById(userId);
            if (user) {
                const deliveryAddr = input.deliveryAddress;
                const exists = user.addresses?.some(addr =>
                    addr.phone === deliveryAddr.phone &&
                    addr.address === deliveryAddr.street &&
                    addr.city === deliveryAddr.city
                );

                if (!exists) {
                    const nameParts = deliveryAddr.name ? deliveryAddr.name.split(" ") : [];
                    const firstName = nameParts.length > 0 ? nameParts[0] : "";
                    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

                    user.addresses = user.addresses || [];
                    user.addresses.push({
                        firstName: firstName,
                        lastName: lastName,
                        address: deliveryAddr.street,
                        city: deliveryAddr.city,
                        state: deliveryAddr.state,
                        country: deliveryAddr.country,
                        phone: deliveryAddr.phone,
                        isDefault: user.addresses.length === 0
                    });
                    await user.save();
                }

                // Send Order Confirmation Email using Resend
                if (user.email) {
                    try {
                        await sendEmail({
                            to: user.email,
                            subject: `Order Confirmation - ${orderNumber}`,
                            html: `
                                <div style="font-family: Arial, sans-serif; padding: 20px;">
                                    <h2 style="color: #4CAF50;">Order Confirmed!</h2>
                                    <p>Hi ${user.username || 'Customer'},</p>
                                    <p>Thank you for shopping with us. Your order <strong>${orderNumber}</strong> has been placed successfully.</p>
                                    <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                                    <p><strong>Payment Method:</strong> ${input.paymentMethod}</p>
                                    <br/>
                                    <p>We will notify you once your order is shipped!</p>
                                </div>
                            `
                        });
                        console.log("Order confirmation email sent to:", user.email);
                    } catch (emailError) {
                        console.error("Failed to send order confirmation email:", emailError);
                    }
                }
            }
        } catch (e) {
            console.error("Failed to save delivery address to user profile", e);
        }

        // Clear the cart if it exists
        if (cart) {
            cart.status = "INACTIVE";
            await cart.save();
        }

        return {
            id: populatedOrder._id,
            userId: populatedOrder.userId,
            shopDetails: populatedOrder.shopDetails,
            orderNumber: populatedOrder.orderNumber,
            items: populatedOrder.items,
            subTotal: populatedOrder.subTotal,
            deliveryCharge: populatedOrder.deliveryCharge,
            totalAmount: populatedOrder.totalAmount,
            status: populatedOrder.status,
            paymentStatus: populatedOrder.paymentStatus,
            paymentMethod: populatedOrder.paymentMethod,
            deliveryAddress: populatedOrder.deliveryAddress,
            notes: populatedOrder.notes,
            image: populatedOrder.image,
            couponCode: populatedOrder.couponCode,
            isCouponApplied: populatedOrder.isCouponApplied,
            deliveryPartner: populatedOrder.deliveryPartner,
            createdAt: populatedOrder.createdAt?.toString(),
            updatedAt: populatedOrder.updatedAt?.toString(),
        };
    },

    async deleteOrder(id: string) {
        const deletedOrder = await OrderModel.findByIdAndDelete(id);
        if (!deletedOrder) {
            throw new Error("Order not found");
        }
        return "Order deleted successfully";
    },

    async updateOrderStatus(id: string, status: string, image?: string) {
        const updateData: any = { status };
        if (image !== undefined) {
            updateData.image = image;
        }

        const item: any = await OrderModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate("shopDetails");

        if (!item) {
            throw new Error("Order not found");
        }

        return {
            id: item._id,
            userId: item.userId?.toString(),
            shopDetails: item.shopDetails,
            orderNumber: item.orderNumber,
            items: item.items,
            subTotal: item.subTotal,
            deliveryCharge: item.deliveryCharge,
            totalAmount: item.totalAmount,
            status: item.status,
            paymentStatus: item.paymentStatus,
            paymentMethod: item.paymentMethod,
            deliveryAddress: item.deliveryAddress,
            notes: item.notes,
            image: item.image,
            couponCode: item.couponCode,
            isCouponApplied: item.isCouponApplied,
            deliveryPartner: item.deliveryPartner,
            createdAt: item.createdAt?.toString(),
            updatedAt: item.updatedAt?.toString(),
        };
    },

    async createRazorpayOrder(amount: number) {
        try {
            const razorpayInstance = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID as string,
                key_secret: process.env.RAZORPAY_KEY_SECRET as string,
            });

            const options = {
                amount: Math.round(amount * 100),
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                payment_capture: 1,
            };

            const order = await razorpayInstance.orders.create(options);
            return {
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            };
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            throw new Error("Failed to create Razorpay order");
        }
    }
};



