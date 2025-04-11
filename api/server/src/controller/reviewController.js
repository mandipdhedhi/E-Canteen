const Review = require('../models/Review');

exports.addReview = async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId }).populate('userId productId');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProductReview = async (req, res) => {
    try {
        const reviews = await Review.find().populate('userId productId');
        res.json(reviews); // Added this line to send the response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProductReview = async (req, res) => {
    try {
        const { id } = req.params; // Get review ID from URL parameters

        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
