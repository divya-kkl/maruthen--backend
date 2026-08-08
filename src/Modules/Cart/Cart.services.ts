import { cartModel } from "../../DB/MongoDB/Cart/Cart.js";
import { productModel } from "../../DB/MongoDB/Product/Product.js";

const populateCartItems = async (items: any[]) => {
    const products = [];
    let totalQuantity = 0;
    let subTotal = 0;

    for (let item of items) {
        const product = await productModel.findById(item.productId);
        if (product) {
            const totalPrice = product.price * item.quantity;
            products.push({
                productId: item.productId,
                productName: product.name,
                productImage: product.images?.[0] || "",
                quantity: item.quantity,
                price: product.price,
                mrp: product.mrp,
                totalPrice: totalPrice,
                size: item.size || "Default"
            });
            totalQuantity += item.quantity;
            subTotal += totalPrice;
        }
    }
    return { products, totalQuantity, subTotal };
};

const formatCart = async (cart: any) => {
    const populated = await populateCartItems(cart.products);
    return {
        id: cart._id,
        userId: cart.userId,
        shopId: cart.shopId,
        products: populated.products,
        totalQuantity: populated.totalQuantity,
        subTotal: populated.subTotal,
        status: cart.status,
        createdAt: cart.createdAt?.toString(),
        updatedAt: cart.updatedAt?.toString()
    };
};

export const CartService = {

    async getAllCarts(search?: string, page?: number, limit?: number) {
        let filter: any = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                $or: [
                    { userId: { $regex: regex } },
                    { shopId: { $regex: regex } }
                ]
            };
        }
        
        let query = cartModel.find(filter);
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        const carts = await query;
        return Promise.all(carts.map(cart => formatCart(cart)));
    },

    async getCart(search?: string, page?: number, limit?: number) {
        return CartService.getAllCarts(search, page, limit);
    },

    async getCartById(id: string) {
        const cart = await cartModel.findById(id);
        if (!cart) {
            throw new Error("Cart not found");
        }
        return formatCart(cart);
    },



    async getCartByUserId(userId: string) {
        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = await cartModel.create({ userId, shopId: "default", products: [], status: "ACTIVE" });
        }
        return formatCart(cart);
    },

    async addToCart(userId: string, shopId: string, productId: string, quantity: number, size?: string) {
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        const itemSize = size || "Default";
        const variant = product.variants?.find((v: any) => v.size === itemSize);

        if (itemSize !== "Default" && !variant) {
            throw new Error(`Variant with size ${itemSize} not found`);
        }

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = await cartModel.create({ userId, shopId, products: [], status: "ACTIVE" });
        } else {
            if (shopId && cart.shopId !== shopId) {
                cart.shopId = shopId;
            }
            // Always ensure the cart becomes ACTIVE when adding new items
            cart.status = "ACTIVE";
        }

        const existingItemIndex = cart.products.findIndex((item: any) => item.productId === productId && (item.size || "Default") === itemSize);
        
        let newTotalQuantity = quantity;
        if (existingItemIndex > -1) {
            newTotalQuantity += cart.products[existingItemIndex]!.quantity;
        }

        // Validate stock if variant exists
        if (variant && newTotalQuantity > variant.stock) {
            throw new Error(`Only ${variant.stock} item(s) available in stock for size ${itemSize}`);
        }

        if (existingItemIndex > -1) {
            cart.products[existingItemIndex]!.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity, size: itemSize });
        }

        await cart.save();

        return formatCart(cart);
    },

    async removeFromCart(userId: string, productId: string, size?: string) {
        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            throw new Error("Cart not found");
        }

        const itemSize = size || "Default";
        cart.products = cart.products.filter((item: any) => !(item.productId === productId && (item.size || "Default") === itemSize));
        await cart.save();

        return formatCart(cart);
    },

    async clearCart(userId: string) {
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            throw new Error("Cart not found");
        }
        cart.products = [];
        cart.status = "ACTIVE";
        await cart.save();
        return "Cart cleared successfully";
    }
};
