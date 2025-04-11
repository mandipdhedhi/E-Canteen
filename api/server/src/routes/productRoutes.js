const express = require('express');
const { createProduct, getAllProducts,deleteProduct,updateProduct } = require('../controller/productController');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.delete('/:id',deleteProduct)
router.put('/:id',updateProduct)

module.exports = router;
    