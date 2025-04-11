const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // status: { type: String, enum: ['pending', 'shipped', 'delivered', 'canceled'], default: 'pending' },
    status:{type:String},
    orderId:{type:mongoose.Schema.Types.ObjectId, ref:'OrderDetail'}
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
