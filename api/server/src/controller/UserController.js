// import usermodel
const usermodel = require("../models/UserModel");
const bcrypt = require('bcrypt');
const adminmode = require("../models/AdminModel")
const mailUtil = require("../utils/MailUtil")
const jwt= require("jsonwebtoken");
const e = require("cors");
const { default: mongoose } = require("mongoose");
const secret="secret";



// function all user 
const getAllUser = async (req, res) => {
    const getalluser = await usermodel.find();

    res.json({
        message: "display all users",
        data: getalluser
    })
}


const getUserById = async (req, res) => {
    try {
        console.log(req.params)
        const userId = req.params.id;
        console.log("Fetching user with ID:", userId);
    

          if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }
     
        // Find user by ID
        const user = await usermodel.findById(userId);
           
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user",
        });
    }
};


// Add users
const addUsers = async (req, res) => {
    try {
        const saveuser = await usermodel.create(req.body)

        res.status(201).json({
            message: "user created successfully....",
            data: saveuser
        })
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "error",
            err: err.message
        })
    }
}

//delete usser 
const deleteUser = async (req, res) => {
    try {
        const deleteuser = await usermodel.findByIdAndDelete(req.params.id)

        res.status(201).json({
            message: "User Deleted Successfully....",
            data: deleteuser
        })
    } catch (err) {
        console.log(err)
        res.status(404).json({
            message: "error...",
            err: err.message
        })
    }
}

// signup page 

const signup = async (req, res) => {
    try {


        const existingUser = await usermodel.findOne({ email: req.body.email });
        const existingAdmin = await adminmode.findOne({ email: req.body.email });
        // console.log(existingAdmin)
        // console.log(existingUser)
        if (existingUser || existingAdmin) {
            return res.status(200).json({ message: "email number already in use" });
        }
        const sale = bcrypt.genSaltSync(10);
        const hashedpassword = bcrypt.hashSync(req.body.password, sale);
        req.body.password = hashedpassword;
        const createUser = await usermodel.create(req.body)

        // await mailUtil.sendingMail(createUser.email,"welcome to eadvertisement","this is welcome mail")
        
        return res.status(201).json({
            message: "Signup Successfully...",
            data: createUser
        })


    } catch (err) {
        console.log(err)
        return res.json({
            message: "error..",
            err: err

        })
    }
}
const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // console.log(email);

        let foundUserFromemail = await usermodel.findOne({ email: email }).populate("roleId");
        
        if (!foundUserFromemail) {
            foundUserFromemail = await adminmode.findOne({ email: email }).populate("roleId");
        }
        // console.log(foundUserFromemail)
        if (foundUserFromemail) {
            if (!password || !foundUserFromemail.password) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isMatch = bcrypt.compareSync(password, foundUserFromemail.password);
            if (isMatch) {
                return res.status(200).json({
                    message: "Login Successfully...",
                    data: foundUserFromemail
                });
            } else {
                return res.status(400).json({
                    message: "Your password is wrong..."
                });
            }
        } else {
            return res.status(404).json({
                message: "User not found..."
            });
        }
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


const loginByToken = async(req,res)=>{

   try{
    const email=req.body.email
    const password=req.body.password
    let userFound= await usermodel.findOne({email:email}).populate("roleId")

    if(!userFound){
        userFound = await adminmode.findOne({email:email}).populate("roleId")
    }

    if(userFound){
        if(!userFound.password || !password){
            return  res.status(400).json({ message: "Invalid credentials" });
        }

    const isMatch = bcrypt.compareSync(password,userFound.password)
        if(isMatch){

            const token = jwt.sign({userFound},secret) 
           console.log(token)
           
            return  res.status(200).json({
                message: "Login Successfully...",
                data: userFound
            });

           
        } else{
            return   res.status(400).json({
                message: "Your password is wrong..."
            })
        }
    }else{
        return  res.status(404).json({
            message:"user Not Found..."
        })
    }
   }catch(err){
    console.error("Login Error:", err);
    return   res.status(500).json({
        message: "Internal Server Error",
        error: err.message
    });
   }


}

const forgotpassword = async(req,res)=>{
    
    const email = req.body.email;
    let foundUserFromemail = await usermodel.findOne({ email: email }).populate("roleId");
        
    if (!foundUserFromemail) {
        foundUserFromemail = await adminmode.findOne({ email: email }).populate("roleId");
    }  

    console.log("user founds",foundUserFromemail)
    if(foundUserFromemail){
       const token = jwt.sign({foundUserFromemail},secret)
       console.log(token)
       const url = `http://localhost:5173/resetpassword/${token}`;
       
       const mailContent =`<html>
                          <a href ="${url}">rest password</a>
                          </html>`;
       
      
        await mailUtil.sendingMail(foundUserFromemail.email,"reset password", mailContent)
       console.log("reset password link sent to mail.")
       res.json({
        message: "reset password link sent to mail.",
       })
       
    }else{
        res.status(404).json({
            message: "user not found register first..",
          });
    }

    
}

const resetpassword = async (req, res) => {
    const token = req.body.token; //decode --> email | id
    console.log("get token",token)
    const newPassword = req.body.password;
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: 'Invalid or missing token' });
    }
    
    const userFromToken = jwt.verify(token, secret);
    console.log(userFromToken.foundUserFromemail._id)
    //object -->email,id..
    //password encrypt...
    const salt = bcrypt.genSaltSync(10);
    const hashedPasseord = bcrypt.hashSync(newPassword,salt);
  
    const updatedUser = await usermodel.findByIdAndUpdate(userFromToken.foundUserFromemail._id, {
      password: hashedPasseord,
    });
    console.log(updatedUser)
    res.json({
      message: "password updated successfully..",
    });
  };


const changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match..." });
        }

        let user = await usermodel.findOne({ email }).populate("roleId");
        if (!user) {
            user = await adminmode.findOne({ email }).populate("roleId");
        }

        if (!user) {
            return res.status(404).json({ message: "User not found..." });
        }

        const isMatch = bcrypt.compareSync(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect..." });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = bcrypt.hashSync(newPassword, salt);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully..." });
    } catch (err) {
        console.error("Change Password Error:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};




// exports

module.exports = {
    getAllUser, addUsers, deleteUser, signup, login,getUserById,changePassword,forgotpassword,resetpassword,loginByToken
}

