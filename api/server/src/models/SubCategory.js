// const mongoose = require('mongoose');

// const SubCategorySchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description:{type:String},
//     // categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
// }, { timestamps: true });

// module.exports = mongoose.model('SubCategory', SubCategorySchema);
const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', SubCategorySchema);