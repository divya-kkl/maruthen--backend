import { gql } from "apollo-server-express";

export const CartType = gql`
  type CartProduct {
    productId: String!
    productName: String!
    productImage: String!
    quantity: Float!
    price: Float!
    mrp: Float!
    totalPrice: Float!
    size: String!
  }

  type Cart {
    id: ID!
    userId: String!
    shopId: String!
    products: [CartProduct]
    totalQuantity: Float!
    subTotal: Float!
    status: String!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    getAllCarts(search: String, page: Int, limit: Int): [Cart]
    getCartById(id: ID!): Cart
    getCart(search: String, page: Int, limit: Int): [Cart]
    getCartByUserId(userId: ID!): Cart
  }

  extend type Mutation {
    addToCart(userId: ID!, shopId: ID!, productId: ID!, quantity: Float!, size: String): Cart!
    removeFromCart(userId: ID!, productId: ID!): Cart!
    clearCart(userId: ID!): String!
  }
`;
