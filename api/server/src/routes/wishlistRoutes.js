const express = require('express');
const { addToWishlist, getUserWishlist ,deleteWishlistItem,deleteWishlistItemAll} = require('../controller/wishlistController');

const router = express.Router();

router.post('/', addToWishlist);
router.get('/:userId', getUserWishlist);
router.delete('/:id',deleteWishlistItem)
router.delete('/all/:userId',deleteWishlistItemAll)

module.exports = router;
