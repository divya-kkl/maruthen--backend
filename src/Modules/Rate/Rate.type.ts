import { gql } from "apollo-server-express";

export const RateType = gql`
  type Rate {
    id: ID!
    date: String
    name: String!
    gram: Float!
    amount: Float!
    type: String
    isCurrent: Boolean
    mc: Float
    mcType: String
    hmc: Float
    hmcType: String
    gst: Float
    createdAt: String
    updatedAt: String
  }

  input RateInput {
    date: String
    name: String!
    gram: Float!
    amount: Float!
    type: String
    isCurrent: Boolean
    mc: Float
    mcType: String
    hmc: Float
    hmcType: String
    gst: Float
  }

  input UpdateRateInput {
    date: String
    name: String
    gram: Float
    amount: Float
    type: String
    isCurrent: Boolean
    mc: Float
    mcType: String
    hmc: Float
    hmcType: String
    gst: Float
  }

  extend type Query {
    getAllRates: [Rate]
    getRateById(id: ID!): Rate
    getCurrentRates: [Rate]
  }

  extend type Mutation {
    createRate(input: RateInput!): Rate!
    updateRate(id: ID!, input: UpdateRateInput!): Rate!
    deleteRate(id: ID!): String!
  }
`;
