const mongoose=require("mongoose");
const Schema=mongoose.Schema

const userSchema= new Schema({
       name:{
        type:String
       },
       phone:{
         type:Number,
        //  unique:true
       },
       address:{
        type:String
       },
       password:{
        type:String
       },
       roleId:{
        type:String,
        ref:"roles"
       },
       canteen:{
        type:String
       },
       email:{
        type:String,
        unique:true
       },
       profilePhoto: {
       type: String,
        default: ""
       }
})



module.exports = mongoose.model("User", userSchema); 