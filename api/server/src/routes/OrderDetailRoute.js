const express = require("express");
const router = express.Router();
const orderDetailController = require("../controller/OrderDetailController");

router.post("/add", orderDetailController.createOrderDetail);
router.get("/all", orderDetailController.getAllOrderDetails);
router.get("/:userId", orderDetailController.getOrderDetailById);
router.put("/update/:id", orderDetailController.updateOrderDetail);
router.delete("/delete/:id", orderDetailController.deleteOrderDetail);
router.get('/orderId/:id',orderDetailController.getOrderDetailByOrderId)

module.exports = router;
