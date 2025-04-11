const mongoose = require('mongoose');


const SiteInfoSchema = new mongoose.Schema({
    siteName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String },
    address1: { type: String, required: true },
    address2: { type: String },
    enableRegistration:{type:Boolean},
    enableReviews:{type:Boolean}
}, { timestamps: true });

module.exports = mongoose.model('SiteInfo', SiteInfoSchema);
