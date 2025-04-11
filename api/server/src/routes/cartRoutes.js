const express = require('express');
const { addToCart, getUserCart ,removeCartById,removeCartAll,updateQuantity} = require('../controller/cartController');

const router = express.Router();

router.post('/', addToCart);
router.get('/:userId', getUserCart);
router.delete('/:id',removeCartById)
router.delete('/all/:userId',removeCartAll)
router.put('/:id',updateQuantity)

module.exports = router;
