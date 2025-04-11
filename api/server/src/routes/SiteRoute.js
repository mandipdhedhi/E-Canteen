const routes=require("express").Router()
const  SiteController=require("../controller/SiteController")

routes.get("/get",SiteController.getAllSiteInfo)
routes.post("/add",SiteController.addSiteInfo)
routes.post("/update/:id",SiteController.updateSiteInfoById)

module.exports=routes 