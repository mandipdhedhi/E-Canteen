const express = require('express');
const { createSubCategory, getAllSubCategories ,deleteSubCategory,getSubCategoriesByCategory} = require('../controller/subCategoryController');


const router = express.Router();

router.post('/', createSubCategory);
router.get('/', getAllSubCategories);
router.delete('/:id',deleteSubCategory)
router.get('/get/:categoryId',getSubCategoriesByCategory)

module.exports = router;
