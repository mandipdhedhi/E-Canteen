const express=require("express");
const app=express();
const mongoose=require("mongoose");
const cors=require("cors")
const path = require("path");
app.use(express.json()) //to accept data as json..
app.use(cors())

const _dirname=path.resolve()
// basic API ctreate

        // app.get("/",(req,res)=>{
        //       res.json({
        //         name:"mandip dhedhi"
        //       })
        // })


const roleRoutes = require("./src/routes/RoleRoutes")
app.use(roleRoutes)

// user route
 const userroute=require("./src/routes/UserRoute")
 app.use(userroute); 
 
 // state
 const stateroute=require("./src/routes/StateRoute")
 app.use("/state",stateroute);

 //city
 const cityroute=require("./src/routes/CityRoute") 
 app.use("/city",cityroute)

 //area 
const arearoute=require("./src/routes/AreaRoute")
app.use("/area",arearoute)

//user address
const useraddressroute=require("./src/routes/UserAddressRoute")
app.use("/useraddress",useraddressroute)

// category 
const categoryrouter=require("./src/routes/categoryRoutes")
app.use("/category",categoryrouter)


//add admin

const adminrouter=require("./src/routes/AdminRoute");
app.use("/admin",adminrouter)


//Update Site Data
const siterouter=require("./src/routes/SiteRoute")
app.use("/site",siterouter)


const categoryRoutes = require("./src/routes/categoryRoutes");
const subCategoryRoutes = require("./src/routes/subCategoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const orderDetail=require("./src/routes/OrderDetailRoute")



app.use("/category", categoryRoutes);
app.use("/subcategory", subCategoryRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/review", reviewRoutes);
app.use("/orderdetail",orderDetail)

// order detail
const orderDetailRoute = require("./src/routes/OrderDetailRoute");
app.use("/orderDetail", orderDetailRoute);

const addressRoutes = require('./src/routes/AddressRoute');
app.use('/address', addressRoutes);

// mongoose data base connection create

   mongoose.connect("mongodb://localhost:27017/myproject"
    ).then(()=>{
      console.log("database connected successfully");
    }).catch((err)=>{
      console.log("database connection error",err);
    });                






app.use(express.static(path.join(_dirname,"/e-canteen/ecanteen/dist")))
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname,"e-canteen","dist","index.html"))
})



      const PORT=3001 || process.env.PORT;
            app.listen(PORT,()=>{
    console.log("server started successfully PORT...",PORT);
})
