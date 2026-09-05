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
    totalOrders: Int!
    totalUsers: Int!
    totalProducts: Int!
    totalCategories: Int!
    totalSubCategories: Int!
    totalCarts: Int!
  }

  type RecentOrder {
    id: ID!
    orderNumber: String
    status: String!
    paymentStatus: String!
    paymentMethod: String!
    totalAmount: Float!
    subTotal: Float!
    deliveryCharge: Float!
    customerName: String!
    customerPhone: String!
    itemCount: Int!
    createdAt: String
    updatedAt: String
  }

  type RevenueStats {
    todayRevenue: Float!
    todayOrders: Int!
    weekRevenue: Float!
    weekOrders: Int!
    monthRevenue: Float!
    monthOrders: Int!
    totalRevenue: Float!
    totalPaidOrders: Int!
  }

  type TopSellingProduct {
    id: ID!
    name: String!
    price: Float!
    images: [String]!
    totalQuantitySold: Int!
    totalRevenue: Float!
  }

  type OrderStatusBreakdown {
    pending: Int!
    processing: Int!
    shipped: Int!
    delivered: Int!
    cancelled: Int!
  }

  type LowStockVariant {
    color: String!
    size: String!
    stock: Float!
  }

  type LowStockProduct {
    id: ID!
    name: String!
    price: Float!
    images: [String]!
    variants: [LowStockVariant]!
  }

  extend type Query {
    getAdminDetails: Admin
    getAllAdminUser(search: String, page: Int, limit: Int): [Admin]
    getDashboardStats: DashboardStats
    getRecentOrders(limit: Int): [RecentOrder]!
    getRevenueStats: RevenueStats!
    getTopSellingProducts(limit: Int): [TopSellingProduct]!
    getOrderStatusBreakdown: OrderStatusBreakdown!
    getLowStockProducts(threshold: Int): [LowStockProduct]!
  }

  extend type Mutation {
    registerAdmin(input: RegisterAdminInput!): AdminAuthResponse!
    loginAdmin(input: LoginAdminInput!): AdminAuthResponse!
  }
`;
