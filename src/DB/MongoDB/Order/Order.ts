import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItem {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
    mrp: number;
    name: string;
    image: string;
    size: string;
}

export interface IDeliveryAddress {
    addressType: string;
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    phone: string;
}

export interface IDeliveryPartner {
    name: string;
    contactNumber: string;
}

export interface IOrder extends Document {
    userId?: Types.ObjectId;
    shopDetails?: Types.ObjectId; // Renamed to shopDetails based on user request (was shopId)
    orderNumber?: string;
    items?: IOrderItem[];
    subTotal?: number;
    deliveryCharge: number;
    totalAmount?: number;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    paymentMethod: string;
    deliveryAddress: IDeliveryAddress;
    notes?: string;
    image?: string;
    couponCode?: string;
    isCouponApplied: boolean;
    deliveryPartner?: IDeliveryPartner;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { 
        type: Schema.Types.ObjectId, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    mrp: { 
        type: Number, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    size: { 
        type: String, 
        required: true 
    }
}, { _id: false });

const DeliveryAddressSchema = new Schema<IDeliveryAddress>({
    addressType: { type: String, required: true, default: "Home" },
    name: { 
        type: String, 
        required: true 
    },
    street: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    }
}, { _id: false });

const DeliveryPartnerSchema = new Schema<IDeliveryPartner>({
    name: { 
        type: String, 
        required: true 
    },
    contactNumber: { 
        type: String, 
        required: true 
    }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    userId: { 
        type: Schema.Types.ObjectId, 
        required: false 
    },
    shopDetails: { 
        type: Schema.Types.ObjectId, 
        ref: 'ShopUser' 
    },
    orderNumber: { 
        type: String, 
        required: false, 
        unique: false 
    },
    items: { 
        type: [OrderItemSchema], 
        required: false 
    },
    subTotal: { 
        type: Number, 
        required: false 
    },
    deliveryCharge: { 
        type: Number, 
        required: true 
    },
    totalAmount: { 
        type: Number, 
        required: false 
    },
    status: { 
        type: String, 
        enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"], 
        default: "PENDING" 
    },
    paymentStatus: { 
        type: String, 
        enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], 
        default: "PENDING" 
    },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    deliveryAddress: { 
        type: DeliveryAddressSchema, 
        required: true 
    },
    notes: { 
        type: String 
    },
    image: { 
        type: String 
    },
    couponCode: { 
        type: String
     },
    isCouponApplied: { 
        type: Boolean, 
        default: false 
    },
    deliveryPartner: { 
        type: DeliveryPartnerSchema
     }
}, {
    timestamps: true
});

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);