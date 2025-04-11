const mongoose=require("mongoose");
const Schema=mongoose.Schema

const useraddressSchema= new Schema({
      userId:{
        type:Schema.Types.ObjectId,
        ref:"User", 
        required: true
      },
      user:{
        type:String,
        required: true
      },
   //   unitName:{
   //      type:String,
   //      required: true
   //   },
     street:{
        type:String,
        required: true
     },
     latitude:{
      type: Number,
      required: true
  },
  longitude:{
      type: Number,
      required: true
  },
     cityId:{
        type:Schema.Types.ObjectId,
        ref:"city",
        required: true
     },
     stateId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'state',
        required: true
     },
    areaId: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'area',
         required: true
       },
    zipcode:{
        type:String,
        required: true
    }    
},{
    timestamps:true
})

module.exports=mongoose.model("useraddress",useraddressSchema)