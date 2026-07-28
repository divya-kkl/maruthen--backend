import { gql } from "apollo-server-express";

export const TagType = gql`
  type Tag {
    id: ID!
    name: String!
    code: String!
    description: String
    status: String!
    createdTime: String
  }

  input CreateTagInput {
    name: String!
    code: String!
    description: String
    status: String
  }

  input UpdateTagInput {
    name: String
    code: String
    description: String
    status: String
  }

  type TagResponse {
    tags: [Tag]
    totalCount: Int
  }

  type Query {
    getAllTags(search: String, page: Int, limit: Int): TagResponse
    getTagById(id: ID!): Tag
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag!
    updateTag(id: ID!, input: UpdateTagInput!): Tag!
    deleteTag(id: ID!): String!
  }
`;
