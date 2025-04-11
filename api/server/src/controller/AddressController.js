const Address = require('../models/AddressModel');

// Get all addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    // console.log(req.params.id)
   
    const user = await Address.find({userId:req.params.id}).populate("state city");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};


// Create new address
exports.createAddress = async (req, res) => {
  
  try {
    // console.log(req)
   
    // If this is the first address, make it default
    const addressCount = await Address.countDocuments({ userId: req.body.userId });
    if (addressCount === 0) {
      addressCount.isDefault = true;
    }
    console.log(req.body)
    const address = await Address.create(req.body);
    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating address'
    });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  console.log(req.body.userId)
  try {
    const address = await Address.findOneAndUpdate(
     
      { _id: req.params.id, userId: req.body.userId},
      req.body,
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating address'
    });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If deleted address was default and other addresses exist, make another one default
    if (address.isDefault) {
      const otherAddress = await Address.findOne({ userId: req.body.userId });
      if (otherAddress) {
        otherAddress.isDefault = true;
        await otherAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address'
    });
  }
};

// Set address as default
exports.setDefaultAddress = async (req, res) => {
  try {
    // First, verify the address exists and belongs to the user
    const address = await Address.findOne({
      _id: req.params.id,
     
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Remove default status from all other addresses
    await Address.updateMany(
      { userId: req.body.userId},
      { isDefault: false }
    );

    // Set the selected address as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting default address'
    });
  }
}; 