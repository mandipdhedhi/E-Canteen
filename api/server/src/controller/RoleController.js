const roleModel=require("../models/RoleModel")


const getAllROle=async(req,res)=>{

    const roles =await roleModel.find()
    res.json({
        message:"role fetched successfully",
        data:roles
    })
}

const addRole = async (req,res)=>{

    const savedRole = await  roleModel.create(req.body)

    res.json({
        message:"ok...",
        data:savedRole
    })
}

const deleteRole=async(req,res)=>{
    const deleteRole=await roleModel.findByIdAndDelete(req.params.id)
    res.json({
        message:"data deleted",
        data:deleteRole
    })
}

const getRoleById = async (req,res)=>{

    //req.params.id
  
    const foundRole = await roleModel.findById(req.params.id)
    res.json({
      message:"role fatched..",
      data:foundRole
    })

}

module.exports={getAllROle,addRole,deleteRole,getRoleById}