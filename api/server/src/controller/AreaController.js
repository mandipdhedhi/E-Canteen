const areamodel=require("../models/AreaModel");

const addArea = async(req,res)=>{
    try{
        const savedarea = await areamodel.create(req.body);
        res.status(201).json({
            message:"new area added...",
            data:savedarea
        })
    }catch(err){
        res.status(500).json({
            err:err
        })
    }

}

const getAllArea = async(req,res)=>{
    try{
       const getallarea = await areamodel.find().populate("cityId stateId")

       res.status(200).json({
        message:"display area...",
        data:getallarea
       })
    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}

const getAreaByCityId=async(req,res)=>{
    try{
        const area=await areamodel.find({cityId:req.params.cityId})

    res.status(200).json({
        message:"dispaly area successfully...",
        data:area
    })
    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}

module.exports={addArea,getAllArea,getAreaByCityId}