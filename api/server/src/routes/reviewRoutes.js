const express = require('express');
const { addReview, getProductReviews,getAllProductReview ,deleteProductReview} = require('../controller/reviewController');

const router = express.Router();

router.post('/', addReview);
router.get('/all/',getAllProductReview)
router.get('/:userId', getProductReviews);
router.delete('/:id',deleteProductReview)

module.exports = router;
