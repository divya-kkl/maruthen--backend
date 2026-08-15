import { gql } from "apollo-server-express";

export const WishlistType = gql`

  type WishlistProduct {
    productId: ID!
    addedAt: String
  }

 
  type Wishlist {
    id: ID!
    userId: ID!
    products: [WishlistProduct]
    createdAt: String
    updatedAt: String
  }

  
  input WishlistInput {
    userId: ID!
    productId: ID!
  }

  extend type Query {
   
    getWishlist(userId: ID!): Wishlist
  }

  extend type Mutation {
    
    addToWishlist(input: WishlistInput!): Wishlist
    removeFromWishlist(input: WishlistInput!): Wishlist
  }
`;
