const jwt = require("jsonwebtoken")
const secret="secret";


const verifyToken=(req,res,next)=>{
    const token=req.headers.authorization;
    if(token){
        if(token.startsWith("Bearer ")){
            token = token.split(" ")[1]
        try{
                        const userFromToken = jwt.verify(token,secret)
                        console.log(userFromToken)
                        next()
                    }catch(err){
                        res.status(500).json({
                            message:"token is not valid...."
                        })
                    }
                }else{
                    res.json({
                         message:"token is not Bearer token"
                    })
                }    
    }else{
        res.status(400).json({
            message:"token is required.."
        })
    }
}

module.exports={verifyToken}