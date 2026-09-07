import { gql } from "apollo-server-express";

export const AdminType = gql`
  type Admin {
    id: ID!
    username: String!
    email: String!
    mobile: String!
    gender: String!
    role: String!
    createdTime: String
  }

  input RegisterAdminInput {
    username: String!
    email: String!
    password: String!
    mobile: String!
    gender: String!
  }

  input LoginAdminInput {
    email: String!
    password: String!
  }

  type AdminAuthResponse {
    user: Admin
    jwtToken: String
  }

  type DashboardStats {
    totalProducts: Int
    totalOrders: Int
    totalUsers: Int
  }

  extend type Query {
    getAdminDetails: Admin
    getAllAdminUser(search: String, page: Int, limit: Int): [Admin]
    getDashboardStats: DashboardStats
  }

  extend type Mutation {
    registerAdmin(input: RegisterAdminInput!): AdminAuthResponse!
    loginAdmin(input: LoginAdminInput!): AdminAuthResponse!
  }
`;
