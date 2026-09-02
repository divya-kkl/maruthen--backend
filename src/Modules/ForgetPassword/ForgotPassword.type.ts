import { gql } from "apollo-server-express";

export const ForgotPasswordType = gql`
  extend type Mutation {
    forgotPassword(email: String!): String!
    resetPassword(token: String!, password: String!): String!
  }
`;
