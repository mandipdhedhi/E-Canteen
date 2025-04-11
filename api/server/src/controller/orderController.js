const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const mongoose = require("mongoose");

exports.updateUserOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params; // Extract orderId from params
        const updateData = req.body; 

        // Validate orderId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid orderId format" });
        }

        const updatedOrderStatus = await Order.findOneAndUpdate(
            { orderId:orderId }, // Correct filter query
            updateData,
            { new: true }
        );

        if (!updatedOrderStatus) {
            return res.status(404).json({ message: "User Order Status not found" });
        }

        res.status(200).json({ 
            message: "User Order Status updated successfully", 
            orderStatus: updatedOrderStatus 
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


