import { mergeResolvers } from "@graphql-tools/merge";
import { UserResolver } from "../Modules/User/User.resolvers.js";
import { ProductResolver } from "../Modules/Product/Product.resolvers.js";
import { ShopUserResolver } from "../Modules/ShopUser/ShopUser.resolvers.js";
import { CartResolver } from "../Modules/Cart/Cart.resolvers.js";
import { OrderResolver } from "../Modules/Order/Order.resolvers.js";
import { ProductCategoryResolver } from "../Modules/ProductCategories/ProductCategories.resolvers.js";
import { CouponResolver } from "../Modules/Coupon/Coupon.resolvers.js";
import { SubCategoryResolver } from "../Modules/SubCategories/SubCategories.resolvers.js";
import { AdminResolver } from "../Modules/Admin/Admin.resolvers.js";
import { BannerResolver } from "../Modules/Banner/Banner.resolvers.js";
import { TopBannerResolver } from "../Modules/TopBanner/TopBanner.resolvers.js";
import { DeliveryChargerResolver } from "../Modules/DeliveryCharger/DeliveryCharger.resolvers.js";
import { FAQResolver } from "../Modules/FAQ/FAQ.resolvers.js";
import { PaymentMethodResolver } from "../Modules/PaymentMethod/PaymentMethod.resolvers.js";

import { ReviewResolver } from "../Modules/Review/Review.resolvers.js";
import { TagResolver } from "../Modules/Tag/Tag.resolvers.js";
import { WishlistResolver } from "../Modules/Wishlist/Wishlist.resolvers.js";
import { RateResolver } from "../Modules/Rate/Rate.resolvers.js";
const resolversArray = [
    UserResolver,
    ProductResolver,
    ShopUserResolver,
    CartResolver,
    OrderResolver,
    ProductCategoryResolver,
    CouponResolver,
    SubCategoryResolver,
    AdminResolver,
    BannerResolver,
    TopBannerResolver,
    DeliveryChargerResolver,
    FAQResolver,
    PaymentMethodResolver,
    ReviewResolver,
    TagResolver,
    WishlistResolver,
    RateResolver
];


export const resolvers = mergeResolvers(resolversArray);
