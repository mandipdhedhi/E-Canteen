const SubCategory = require('../models/SubCategory');

exports.createSubCategory = async (req, res) => {
    try {
        const subCategory = new SubCategory(req.body);
        await subCategory.save();
        res.status(201).json(subCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSubCategory = async (req, res) => {
    try {
        const subCategoryId = req.params.id;
        
        // Find and delete the subcategory
        const deletedSubCategory = await SubCategory.findByIdAndDelete(subCategoryId);
        
        if (!deletedSubCategory) {
            return res.status(404).json({
                message: "Subcategory not found"
            });
        }

        res.status(200).json({
            message: "Subcategory deleted successfully",
            data: deletedSubCategory
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
exports.getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('categoryId');
        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubCategoriesByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        // console.log(categoryId)
        const subCategories = await SubCategory.find({ categoryId:categoryId }).populate('categoryId');
        
        res.status(200).json({
            message: "Subcategories fetched successfully",
            data: subCategories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
