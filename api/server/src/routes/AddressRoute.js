const express = require('express');
const router = express.Router();
// const { protect } = require('../controller/AddressController');
const {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,getUserById
} = require('../controller/AddressController');

// All routes are protected
// router.use(protect);

// Get all addresses for the logged-in user
router.get('/user', getUserAddresses);
router.get('/user/:id',getUserById)

// Create a new address
router.post('/', createAddress);

// Update an address
router.put('/:id', updateAddress);

// Delete an address
router.delete('/:id', deleteAddress);

// Set an address as default
router.put('/:id/default', setDefaultAddress);

module.exports = router; 