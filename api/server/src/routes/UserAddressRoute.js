const route=require("express").Router()
const useraddresscontroller=require("../controller/UserAddressController")

route.post("/adduseraddress",useraddresscontroller.addUserAddress);
route.get("/",useraddresscontroller.getAllUserAddress)
route.get("/getaddress/:id",useraddresscontroller.getUserAddressById)

module.exports=route