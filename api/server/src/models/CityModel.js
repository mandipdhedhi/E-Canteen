const mongoose=require("mongoose");
const Schema=mongoose.Schema

const citySchama=new Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    stateId:{
        type:Schema.Types.ObjectId,
        ref:"state"
    }
},
{timestamps:true});

module.exports=mongoose.model("city",citySchama)