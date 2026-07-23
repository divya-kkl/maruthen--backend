import { ReviewModel } from "../../DB/MongoDB/Review/Review.js";
import { productModel } from "../../DB/MongoDB/Product/Product.js";

// Helper function to update average rating and review count of a product
async function updateProductRatingStats(productId: string) {
    const allReviews = await ReviewModel.find({ productId });
    const numReviews = allReviews.length;
    
    let averageRating = 0;
    if (numReviews > 0) {
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        averageRating = totalRating / numReviews;
    }

    await productModel.findByIdAndUpdate(productId, {
        rating: parseFloat(averageRating.toFixed(1)),
        numReviews: numReviews
    });
}

export const ReviewService = {
    // 1. Get all reviews in the system (For Admin Panel)
    async getAllProductReviews(page?: number, limit?: number, search?: string) {
        let filter: any = {};
        
        // Search by userName, comment, or product name
        if (search) {
            const regex = new RegExp(search, 'i');
            const matchingProducts = await productModel.find({ name: { $regex: regex } }, '_id');
            const matchingProductIds = matchingProducts.map(p => p._id);

            filter = {
                $or: [
                    { userName: { $regex: regex } },
                    { comment: { $regex: regex } },
                    { productId: { $in: matchingProductIds } }
                ]
            };
        }

        const totalCount = await ReviewModel.countDocuments(filter);
        let query = ReviewModel.find(filter).sort({ createdAt: -1 });

        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }

        const reviews = await query;

        return {
            reviews: reviews.map(r => ({
                id: r._id,
                productId: r.productId.toString(),
                orderId: r.orderId?.toString(),
                userId: r.userId.toString(),
                userName: r.userName,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt?.toString(),
                updatedAt: r.updatedAt?.toString()
            })),
            totalCount
        };
    },

    // 2. Get reviews for a specific product
    async getProductReviews(productId: string) {
        const reviews = await ReviewModel.find({ productId }).sort({ createdAt: -1 });
        const product = await productModel.findById(productId);
        return {
            reviews: reviews.map(r => ({
                id: r._id,
                productId: r.productId.toString(),
                orderId: r.orderId?.toString(),
                userId: r.userId.toString(),
                userName: r.userName,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt?.toString(),
                updatedAt: r.updatedAt?.toString()
            })),
            averageRating: product?.rating || 0,
            totalCount: reviews.length
        };
    },

    // 3. Create a review
    async createReview(input: any) {
        const newReview = await ReviewModel.create(input);
        await updateProductRatingStats(input.productId);

        return {
            id: newReview._id,
            productId: newReview.productId.toString(),
            orderId: newReview.orderId?.toString(),
            userId: newReview.userId.toString(),
            userName: newReview.userName,
            rating: newReview.rating,
            comment: newReview.comment,
            createdAt: newReview.createdAt?.toString(),
            updatedAt: newReview.updatedAt?.toString()
        };
    },

    // 4. Update review
    async updateReview(id: string, input: any) {
        const updatedReview = await ReviewModel.findByIdAndUpdate(
            id, 
            { rating: input.rating, comment: input.comment }, 
            { new: true }
        );
        if (!updatedReview) {
            throw new Error("Review not found");
        }
        
        await updateProductRatingStats(updatedReview.productId.toString());

        return {
            id: updatedReview._id,
            productId: updatedReview.productId.toString(),
            orderId: updatedReview.orderId?.toString(),
            userId: updatedReview.userId.toString(),
            userName: updatedReview.userName,
            rating: updatedReview.rating,
            comment: updatedReview.comment,
            createdAt: updatedReview.createdAt?.toString(),
            updatedAt: updatedReview.updatedAt?.toString()
        };
    },

    // 5. Delete review
    async deleteReview(id: string) {
        const deletedReview = await ReviewModel.findByIdAndDelete(id);
        if (!deletedReview) {
            throw new Error("Review not found");
        }

        await updateProductRatingStats(deletedReview.productId.toString());
        return "Review deleted successfully";
    }
};
