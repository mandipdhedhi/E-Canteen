const route=require("express").Router()
const areacontroller=require("../controller/AreaController")

route.post("/addarea",areacontroller.addArea);
route.get("/",areacontroller.getAllArea);
route.get("/getareabycity/:cityId",areacontroller.getAreaByCityId)

module.exports=route;