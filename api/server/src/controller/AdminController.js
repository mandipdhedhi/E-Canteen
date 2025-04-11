const adminmodel=require("../models/AdminModel");
const bcrypt = require('bcrypt');

const addAdmin=async(req,res)=>{
    try{
      const sale=bcrypt.genSaltSync(10);
      const hashedpassword=bcrypt.hashSync(req.body.password,sale);
      req.body.password=hashedpassword;

      const createAdmin=await adminmodel.create(req.body);
    
      res.status(201).json({
        message:"New admin Added...",
        data:createAdmin
      })
    }catch(err){
        console.log(err)
        return res.json({
            message: "error..",
            err: err
        })
    }
}


const getAdminById=async(req,res)=>{
  const findAdmin = await adminmodel.findById(req.params.id)

  res.json({
    data:findAdmin
  })
}

module.exports={
    addAdmin,getAdminById
}