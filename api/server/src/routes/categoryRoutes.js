const express = require('express');
const categorycontroller = require('../controller/CategoryController');

const router = express.Router();

router.post('/', categorycontroller.addCategory);
router.get('/', categorycontroller.getAllCategory);
router.delete('/:id',categorycontroller.deleteCategory)
router.put('/:id',categorycontroller.updateCategory)

module.exports = router;
