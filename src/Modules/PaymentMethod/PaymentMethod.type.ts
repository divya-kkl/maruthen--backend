import { gql } from "apollo-server-express";

export const PaymentMethodType = gql`
  type PaymentMethod {
    id: ID!
    name: String!
    value: String!
    description: String!
    icon: String!
    status: String!
    sortOrder: Int!
    createdAt: String
    updatedAt: String
  }

  input CreatePaymentMethodInput {
    name: String!
    value: String!
    description: String
    icon: String
    status: String
    sortOrder: Int
  }

  input UpdatePaymentMethodInput {
    name: String
    value: String
    description: String
    icon: String
    status: String
    sortOrder: Int
  }

  extend type Query {
    getAllPaymentMethods: [PaymentMethod]
    getActivePaymentMethods: [PaymentMethod]
    getPaymentMethodById(id: ID!): PaymentMethod
  }

  extend type Mutation {
    createPaymentMethod(input: CreatePaymentMethodInput!): PaymentMethod!
    updatePaymentMethod(id: ID!, input: UpdatePaymentMethodInput!): PaymentMethod!
    deletePaymentMethod(id: ID!): String!
  }
`;
