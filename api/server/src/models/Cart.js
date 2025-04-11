const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number }
}, { timestamps: true });
CartSchema.index({ userId: 1, productId: 1 }, { unique: true });
module.exports = mongoose.model('Cart', CartSchema);
