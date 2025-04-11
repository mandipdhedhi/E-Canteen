const route=require("express").Router();
const statecontroller=require("../controller/StateController");

route.post("/addstate",statecontroller.addState)
route.get("/",statecontroller.getAllState)
route.delete("/delete/:stateId",statecontroller.deleteStateById)
route.put("/update/:stateId",statecontroller.updateStateById)

module.exports=route