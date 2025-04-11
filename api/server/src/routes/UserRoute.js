const route = require("express").Router();
const usercontroller = require("../controller/UserController")

route.get("/users",usercontroller.getAllUser);
route.post("/user",usercontroller.addUsers)
route.delete("/user/:id",usercontroller.deleteUser)
route.post("/signup",usercontroller.signup)
route.post("/login",usercontroller.login)
route.get("/user/:id",usercontroller.getUserById)
route.post("/user/changepassword",usercontroller.changePassword)
route.post("/forgot",usercontroller.forgotpassword)
route.post("/resetpassword",usercontroller.resetpassword)

module.exports=route