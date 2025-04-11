const citymodel=require("../models/CityModel");

const addCity = async(req,res)=>{
    try{
      const savedCity = await citymodel.create(req.body);
      res.status(201).json({
        message:"display all city..",
        data:savedCity
      })
    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}

const getAllCity = async(req,res)=>{
   try{
    const getallcity=await citymodel.find().populate("stateId");
    res.status(200).json({
        message:"dispaly all city",
        data:getallcity
    })
   }catch(err){
    res.status(500).json({
        err:err
    })
   }

}


const getCityByStateId = async (req, res) => {
    try {
      console.log(req.params.stateId)
      const cities = await citymodel.find({ stateId: req.params.stateId });
      res.status(200).json({
        message: "city found",
        data: cities,
      });
    } catch (err) {
      res.status(500).json({
        message: "city  not found",
      });
    }
  };

  const deleteCityById = async (req, res) => {
    try {
      const deletedCity = await citymodel.findByIdAndDelete(req.params.cityId);
      if (!deletedCity) {
        return res.status(404).json({
          message: "City not found",
        });
      }
      res.status(200).json({
        message: "City deleted successfully",
        data: deletedCity,
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to delete city",
      });
    }
  };

  const updateCityById = async (req, res) => {
    try {
      const updatedCity = await citymodel.findByIdAndUpdate(
        req.params.cityId,
        req.body,
        { new: true } // returns the updated document
      );
  
      if (!updatedCity) {
        return res.status(404).json({
          message: "City not found",
        });
      }
  
      res.status(200).json({
        message: "City updated successfully",
        data: updatedCity,
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to update city",
      });
    }
  };
  
  
module.exports={addCity,getAllCity,getCityByStateId,deleteCityById,updateCityById}