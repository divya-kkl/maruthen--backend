import { gql } from "apollo-server-express";

export const VideoType = gql`
  type Video {
    id: ID!
    title: String!
    description: String!
    videoUrl: String!
    thumbnailUrl: String
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  input VideoInput {
    title: String!
    description: String!
    videoUrl: String!
    thumbnailUrl: String
    isActive: Boolean
  }

  input UpdateVideoInput {
    title: String
    description: String
    videoUrl: String
    thumbnailUrl: String
    isActive: Boolean
  }

  extend type Query {
    getAllVideos: [Video]
    getActiveVideos: [Video]
    getVideoById(id: ID!): Video
  }

  extend type Mutation {
    createVideo(input: VideoInput!): Video!
    updateVideo(id: ID!, input: UpdateVideoInput!): Video!
    deleteVideo(id: ID!): String!
    toggleVideoStatus(id: ID!): Video!
  }
`;
