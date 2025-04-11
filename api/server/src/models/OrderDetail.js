const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema({
    // addressId:{type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true},
    addressId:{type:Array},
    // orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    // productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    // quantity: { type: Number, required: true },
    // price: { type: Number, required: true },
    // status: { type: String, enum: ["pending", "shipped", "delivered", "canceled"], default: "pending" },
    paymentMethod:{type:String},
    // items:{type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true},
    items:{type:Array},
    total:{type:Number},
    discount:{type:Number},
    deliveryFee:{type:Number},
    tax:{type:Number},
    Subtotal:{type:Number},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

    


}, { timestamps: true });

module.exports = mongoose.model("OrderDetail", orderDetailSchema);
