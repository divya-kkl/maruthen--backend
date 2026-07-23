import { gql } from "apollo-server-express";

export const ReviewType = gql`

type Review {
    id: ID!
    productId: ID!
    orderId: ID
    userId: ID!
    userName: String!
    rating: Float!
    comment: String
    createdAt: String
    updatedAt: String
    product: Product
}

input CreateReviewInput {
    productId: ID!
    orderId: ID
    userId: ID!
    userName: String!
    rating: Float!
    comment: String
}

input UpdateReviewInput {
    rating: Float!
    comment: String
}

type ReviewResponse {
    reviews: [Review]
    averageRating: Float
    totalCount: Int
}

type AllReviewsResponse {
    reviews: [Review]
    totalCount: Int
}

extend type Query {
    getProductReviews(productId: ID!): ReviewResponse
    getAllProductReviews(page: Int, limit: Int, search: String): AllReviewsResponse
}

extend type Mutation {
    createReview(input: CreateReviewInput!): Review!
    updateReview(id: ID!, input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): String!
}
`;