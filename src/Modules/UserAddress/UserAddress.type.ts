import { gql } from "apollo-server-express";

export const userAddressType = gql`
  type UserAddress {
    id: ID!
    userId: ID
    firstName: String
    lastName: String
    address: String
    apartment: String
    city: String
    state: String
    pincode: Int
    country: String
    phone: String
    isDefault: Boolean
    createdAt: String
    updatedAt: String
  }

  input UserAddressInput {
    firstName: String
    lastName: String
    address: String
    apartment: String
    city: String
    state: String
    pincode: Int
    country: String
    phone: String
    isDefault: Boolean
  }

  extend type Query {
    getMyAddresses: [UserAddress!]!
    getAllUserAddress(userId: ID): [UserAddress!]!
  }

  extend type Mutation {
    addUserAddress(input: UserAddressInput!): UserAddress!
    updateUserAddress(addressId: ID!, input: UserAddressInput!): UserAddress!
    deleteUserAddress(addressId: ID!): Boolean!
    setDefaultAddress(addressId: ID!): UserAddress!
  }
`;
