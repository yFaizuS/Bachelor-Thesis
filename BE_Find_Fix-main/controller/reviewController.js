const ReviewModel = require('../models/review');
const reviewController = {};

// Membuat Pesanan Baru
reviewController.createReview = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Extracting text fields from the request bodyF
        const { rating, review } = req.body;
        const userId = req.user.id;
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ code: 400, status: "Bad Request", message: "Rating must be between 1 and 5" });
        }
        // Add review data to Firestore
        const reviewData = {
            userId,
            orderId,
            rating,
            review
        };

        await ReviewModel.addReview(reviewData);
        res.status(200).json({ code: 200, status: "Review Created" });

    } catch (error) {
        res.status(400).json({ code: 400, status: "Internal Server Error", message: error.message });
    }
};
module.exports = reviewController;