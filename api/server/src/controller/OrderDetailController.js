const OrderDetail = require("../models/OrderDetail");

// Create a new OrderDetail
exports.createOrderDetail = async (req, res) => {
    try {
        
        const {addressId, paymentMethod, items, total, discount, deliveryFee, tax,userId,Subtotal } = req.body;

        if (!addressId || !paymentMethod || !items || !userId ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const savedOrderDetail = await OrderDetail.create({
            addressId,
            paymentMethod,
            items,
            total,
            discount,
            deliveryFee,
            tax,
            userId,Subtotal
        });

        res.status(201).json({ message: "Order detail added successfully", data:savedOrderDetail });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Get all OrderDetails
exports.getAllOrderDetails = async (req, res) => {
    try {
        const orderDetails = await OrderDetail.find();
        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Get OrderDetail by userId
exports.getOrderDetailById = async (req, res) => {
    try {
        // console.log(req.params.userId)
        const orderDetail = await OrderDetail.find({userId:req.params.userId}).populate("addressId userId");
        if (!orderDetail) {
            return res.status(404).json({ message: "Order Detail not found" });
        }
        res.status(200).json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Get OrderDetail by OrderId
exports.getOrderDetailByOrderId = async (req, res) => {
    try {
        const { id } = req.params;
   
        // Validate ObjectId
       
        const orderDetail = await OrderDetail.find().select("_id").populate("addressId userId items");

        if (!orderDetail) {
            return res.status(404).json({ message: "Order Detail not found" });
        }

        res.status(200).json(orderDetail);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Update OrderDetail
exports.updateOrderDetail = async (req, res) => {
    try {
        const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrderDetail) {
            return res.status(404).json({ message: "Order Detail not found" });
        }
        res.status(200).json({ message: "Order Detail updated successfully", orderDetail: updatedOrderDetail });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Delete OrderDetail
exports.deleteOrderDetail = async (req, res) => {
    try {
        const deletedOrderDetail = await OrderDetail.findByIdAndDelete(req.params.id);
        if (!deletedOrderDetail) {
            return res.status(404).json({ message: "Order Detail not found" });
        }
        res.status(200).json({ message: "Order Detail deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
