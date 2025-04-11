const route=require("express").Router();
const admincontroller=require("../controller/AdminController")
const usercontroller = require("../controller/UserController")



route.post("/addAdmin",admincontroller.addAdmin);
route.get("/getadminbyid/:id",admincontroller.getAdminById)
route.post("/changepassword/",usercontroller.changePassword)

module.exports=route;