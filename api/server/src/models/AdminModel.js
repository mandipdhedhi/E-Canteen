const mongoose=require("mongoose");
const Schema=mongoose.Schema

const adminSchema=new Schema({
    name:{
        type:String,
        // requird:true
    },
    phone:{
        type:Number,
        // requird:true,
    },
    password:{
        type:String,
        // requird:true
    },
    roleId:{
        type:String,
        ref:"roles",
        // requird:true
       },
       email:{
        type:String,
        
       }
})

module.exports=mongoose.model("admin",adminSchema)