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
  }

  input UpdateRateInput {
    date: String
    name: String
    gram: Float
    amount: Float
    type: String
    isCurrent: Boolean
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
