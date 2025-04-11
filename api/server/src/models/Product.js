const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    basePrice: { type: Number, required: true },
    offerPrice: { type: Number },
    offerPercentage: { type: Number },
    productDetail: { type: String },
    productImageURL1: { type: String },
    productImageURL2: { type: String },
    productImageURL3: { type: String },
    // quantity: { type: Number, required: true },
    inStock:{type:Boolean}

}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
