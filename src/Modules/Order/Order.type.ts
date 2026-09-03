import { gql } from "apollo-server-express";

export const OrderType = gql`
  type OrderItem {
    productId: ID!
    quantity: Int!
    price: Float!
    mrp: Float!
    name: String!
    image: String!
    size: String!
  }

  type DeliveryAddress {
    addressType: String!
    name: String!
    street: String!
    city: String!
    state: String!
    country: String!
    phone: String!
    pincode: String
  }

  type DeliveryPartner {
    name: String!
    contactNumber: String!
  }

  type Order {
    id: ID!
    userId: ID!
    shopDetails: ShopUser
    orderNumber: String!
    items: [OrderItem!]!
    subTotal: Float!
    deliveryCharge: Float!
    totalAmount: Float!
    status: String!
    paymentStatus: String!
    paymentMethod: String!
    deliveryAddress: DeliveryAddress!
    notes: String
    image: String
    couponCode: String
    isCouponApplied: Boolean!
    deliveryPartner: DeliveryPartner
    razorpayOrderId: String
    createdAt: String!
    updatedAt: String!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
    price: Float!
    mrp: Float!
    name: String!
    image: String!
    size: String!
  }

  input DeliveryAddressInput {
    addressType: String!
    name: String!
    street: String!
    city: String!
    state: String!
    country: String!
    phone: String!
    pincode: String
  }

  input DeliveryPartnerInput {
    name: String!
    contactNumber: String!
  }

  input PlaceOrderInput {
    shopDetails: ID
    deliveryCharge: Float!
    paymentMethod: String!
    deliveryAddress: DeliveryAddressInput!
    notes: String
    image: String
    couponCode: String
    razorpayOrderId: String
    razorpayPaymentId: String
    razorpaySignature: String
    email: String
    guestCartItems: [OrderItemInput!]
  }

  type OrderResponse {
    orders: [Order]
    totalCount: Int
  }

  type RazorpayOrderResponse {
    success: Boolean!
    orderId: String
    amount: Int
    currency: String
  }

  type Query {
    getAllOrders(search: String, page: Int, limit: Int): OrderResponse

    getOrderById(id: ID!): Order
    getOrder(search: String, page: Int, limit: Int): OrderResponse
    getUserAddresses: [DeliveryAddress!]!
  }

  type Mutation {
    placeOrder(input: PlaceOrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!, image: String): Order!
    deleteOrder(id: ID!): String!
    createRazorpayOrder(amount: Float!): RazorpayOrderResponse
  }
`;


