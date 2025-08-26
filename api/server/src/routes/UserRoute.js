const route = require("express").Router();
const usercontroller = require("../controller/UserController")
const authmiddlewarwe= require("../midleware/Authmiddleware")
const multer =require("multer")
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); // folder to save files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });


// route.get("/users",authmiddlewarwe.verifyToken,usercontroller.getAllUser);
route.get("/users",usercontroller.getAllUser);

route.post("/user",usercontroller.addUsers)
route.delete("/user/:id",usercontroller.deleteUser)
route.post("/signup",usercontroller.signup)
// route.post("/login",usercontroller.login)
route.post("/login",usercontroller.loginByToken) 

route.get("/user/:id",usercontroller.getUserById)
route.post("/user/changepassword",upload.single("profilePhoto"),usercontroller.changePassword)
route.post("/forgot",usercontroller.forgotpassword)
route.post("/resetpassword",usercontroller.resetpassword)

module.exports=route