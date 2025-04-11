const express = require('express');
const { createOrder, getUserOrders,getAllOrders,updateUserOrderStatus } = require('../controller/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/:userId', getUserOrders);
router.get('/',getAllOrders)
router.put('/:orderId',updateUserOrderStatus)


module.exports = router;
