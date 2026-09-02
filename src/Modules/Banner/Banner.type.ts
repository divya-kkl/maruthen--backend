import { gql } from "apollo-server-express";

export const BannerType = gql`
  type Banner {
    id: ID!
    backgroundImages: [String!]!
    sideImage: String
    sideContent: String
    bannerType: String
    isActive: Boolean
    fontColor: String
    fontSize: String
    buttonColor: String
    buttonSize: String
    contentPosition: String
    imagePosition: String
    createdAt: String
    updatedAt: String
  }

  input BannerInput {
    backgroundImages: [String!]!
    sideImage: String
    sideContent: String
    bannerType: String
    isActive: Boolean
    fontColor: String
    fontSize: String
    buttonColor: String
    buttonSize: String
    contentPosition: String
    imagePosition: String
  }

  input UpdateBannerInput {
    backgroundImages: [String!]
    sideImage: String
    sideContent: String
    bannerType: String
    isActive: Boolean
    fontColor: String
    fontSize: String
    buttonColor: String
    buttonSize: String
    contentPosition: String
    imagePosition: String
  }

  extend type Query {
    getAllBanners(bannerType: String): [Banner]
    getActiveBanners(bannerType: String): [Banner]
    getBannerById(id: ID!): Banner
  }

  extend type Mutation {
    createBanner(input: BannerInput!): Banner!
    updateBanner(id: ID!, input: UpdateBannerInput!): Banner!
    deleteBanner(id: ID!): String!
  }
`;
