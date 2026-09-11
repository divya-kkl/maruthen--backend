import { gql } from "apollo-server-express";

export const ImageType = gql`
  type Image {
    id: ID!
    title: String!
    description: String
    imageUrl: String!
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  input ImageInput {
    title: String!
    description: String
    imageUrl: String!
    isActive: Boolean
  }

  input UpdateImageInput {
    title: String
    description: String
    imageUrl: String
    isActive: Boolean
  }

  extend type Query {
    getAllImages: [Image]
    getActiveImages: [Image]
    getImageById(id: ID!): Image
  }

  extend type Mutation {
    createImage(input: ImageInput!): Image!
    updateImage(id: ID!, input: UpdateImageInput!): Image!
    deleteImage(id: ID!): String!
    toggleImageStatus(id: ID!): Image!
  }
`;
