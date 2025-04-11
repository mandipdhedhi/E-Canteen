const route =require("express").Router()

const citycontroller=require("../controller/CityController")

route.post("/addcity",citycontroller.addCity)
route.get("/",citycontroller.getAllCity)
route.get("/getcitybystate/:stateId",citycontroller.getCityByStateId)
route.delete("/delete/:cityId",citycontroller.deleteCityById)
route.put("/update/:cityId",citycontroller.updateCityById)



module.exports=route;