const useraddressmodel=require("../models/UserAddressModel");
const UserModel = require("../models/UserModel");

const addUserAddress=async(req,res)=>{
    try{
        const saveduseraddress=await useraddressmodel.create(req.body);

        res.status(201).json({
            message:"new adress added...",
            data:saveduseraddress

        })
    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}

const getAllUserAddress=async(req,res)=>{
    try{
        const getalluseraddress=await useraddressmodel.find().populate("userId stateId cityId areaId");

        res.status(200).json({
            message:"display all user address..",
            data:getalluseraddress
        })
    }catch(err){
        res.status(500).json({
            err:err
        })
    }
}

const getUserAddressById=async(req,res)=>{

    console.log(req.params.id)
    try{
    //  console.log(req.params)
     const getuseraddress=await useraddressmodel.find({userId:req.params.id}).populate("userId stateId cityId areaId");


     res.status(200).json({
        message:"display all user address..",
        data:getuseraddress
    })
    }catch(err){
        console.log(err)
        res.status(500).json({
            err:err

        })
    }
}


module.exports={
    addUserAddress,getAllUserAddress,getUserAddressById
}