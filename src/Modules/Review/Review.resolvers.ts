import { ReviewService } from "./Review.services.js";

export const ReviewResolver = {
    Query: {
        getProductReviews: async (_: any, { productId }: { productId: string }) => {
            return ReviewService.getProductReviews(productId);
        },
        getAllProductReviews: async (_: any, { page, limit, search }: { page?: number, limit?: number, search?: string }) => {
            return ReviewService.getAllProductReviews(page, limit, search);
        }
    },
    Review: {
        product: async (parent: any) => {
            const { ProductService } = await import("../Product/Product.services.js");
            return ProductService.getProductById(parent.productId.toString());
        }
    },
    Mutation: {
        createReview: async (_: any, { input }: { input: any }) => {
            return ReviewService.createReview(input);
        },
        updateReview: async (_: any, { id, input }: { id: string, input: any }) => {
            return ReviewService.updateReview(id, input);
        },
        deleteReview: async (_: any, { id }: { id: string }) => {
            return ReviewService.deleteReview(id);
        }
    }
};
