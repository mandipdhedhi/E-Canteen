const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type:mongoose.Schema.ObjectId,
        ref:"city",
    trim: true
  },
  state: {
    type: mongoose.Schema.Types.ObjectId, 
           ref: 'state',
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{6}$/
  },
  addressType: {
    type: String,
    required: true,
    enum: ['home', 'work', 'other']
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('Address', addressSchema); 