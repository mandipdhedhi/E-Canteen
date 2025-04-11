const categorymodel=require("../models/Category")

const addCategory=async(req,res)=>{
    try{
       const savedcategory=await categorymodel.create(req.body);

       res.status(201).json({
        message:"new category added...",
        data:savedcategory
       })
    }catch(err){
        res.status(500).json({
            err:err
        })
    }

}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Find and delete the category
        const deletedCategory = await categorymodel.findByIdAndDelete(categoryId);
        
        if (!deletedCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully",
            data: deletedCategory
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}; 


const updateCategory = async (req, res) => {
    try {
        const id = req.params.id; // Extract ID properly

        
        // Find and update the category
        const updatedCategory = await categorymodel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (err) {
       
        res.status(500).json({
            error: err.message
        });
    }
};


const getAllCategory=async(req,res)=>{
    try{
       const getallcategory=await categorymodel.find();

       res.status(200).json({
        message:"dispaly all category..,",
        data:getallcategory
       })
    }catch(err){
        
        res.status(500).json({
            err:err
        })
    }

    
}
module.exports={
    addCategory,getAllCategory,deleteCategory,updateCategory
}