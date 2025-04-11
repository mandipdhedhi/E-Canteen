const statemodel=require("../models/StateModel");
 
const addState= async(req,res)=>{
    try{
       const savedstate=await statemodel.create(req.body);
       res.status(201).json({
        message:"new state added",
        data:savedstate
       })
    }catch(err){
        res.status(500).json({
             message:"error.",
             err:err
             
        })
    }
}

const getAllState = async(req,res)=>{
    try{
       const getallstate=await statemodel.find()
       res.status(200).json({
        message:"all data display...",
        data:getallstate
       })
    }catch(err){
       err:err
    }
}


const deleteStateById = async (req, res) => {
    try {
      const deletedState = await statemodel.findByIdAndDelete(req.params.stateId);
      if (!deletedState) {
        return res.status(404).json({
          message: "State not found",
        });
      }
      res.status(200).json({
        message: "State deleted successfully",
        data: deletedState,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error deleting state",
        err: err,
      });
    }
  };

  const updateStateById = async (req, res) => {
    try {
      const updatedState = await statemodel.findByIdAndUpdate(
        req.params.stateId,
        req.body,
        { new: true }
      );
  
      if (!updatedState) {
        return res.status(404).json({
          message: "State not found",
        });
      }
  
      res.status(200).json({
        message: "State updated successfully",
        data: updatedState,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error updating state",
        err: err,
      });
    }
  };
  
  
module.exports={addState,getAllState,deleteStateById,updateStateById}