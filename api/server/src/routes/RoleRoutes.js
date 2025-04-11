const routes=require("express").Router()
const rolecontroller=require("../controller/RoleController")



routes.get("/roles",rolecontroller.getAllROle)
routes.post("/role",rolecontroller.addRole)
routes.delete("/role/:id",rolecontroller.deleteRole)
routes.get("/role/:id",rolecontroller.getRoleById)

module.exports=routes 