import React, { useEffect } from 'react'
import '../assets/img/login.css'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Loginpage = () => {

  
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  const formvalidation = {
    phonevalidation: {
      required: {
        value: true,
        message: "phone number is required"
      }
      ,
      minLength: {
        value: 5,
        message: "name is minimum 5 ch.."
      }

    },


    passwordvalidation: {
      required: {
        value: true,
        message: "password is required"
      }
    }
  }

  const submithandle = async (data) => {
    try {
      console.log("Survey Data:", data);
      

      const res = await axios.post("/login", data);

      console.log(res);

      if (res.status === 200) {
        // alert("Login Successfully...");
        toast.success('Login Successfully...');
      
      localStorage.setItem("id",res.data.data._id)
      localStorage.setItem("role",res.data.data.roleId.role)
      
    

      setTimeout(() => {
        if(res.data.data.roleId.role==="user" || res.data.data.roleId.role==="customer" || res.data.data.roleId.role==="ServiceProvider"){
          navigate("/user")
        }else if(res.data.data.roleId.role==="admin"){
          navigate("/admin")
        }
      }, 2000);
      

      } else {
        alert("Login Failed. Please try again.");
      }

    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        if (error.response.status === 404) {
          // alert("User not found");
          toast.warn('User not found')
        } else if (error.response.status === 400) {
          // alert("Incorrect password");
          toast.warn('Incorrect password')
        } else {
          
          alert("An error occurred during login. Please try again later.");
        }
      } else {
        // alert("Network error. Please check your connection.");

        toast.error('Network error. Please check your connection!')
      }
    }
  };

  const navigate=useNavigate()
  const location = useLocation();
  
 
  return (
    <div className='login-main'>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <form onSubmit={handleSubmit(submithandle)}>
        <div style={{ color: 'black' }} className="login-containar">

          <div className='signinh'><b>Sign in To E-Canteen</b></div>



          <div className='inputdiv'><input type="text" placeholder='email' {...register("email", formvalidation.phonevalidation)} />
            <span>
              {
                errors.email?.message
              }
            </span>
          </div>



          <div className="inputdiv">
            <input type="password" placeholder='Password'  autocomplete="current-password" {...register("password", formvalidation.passwordvalidation)} />
            <span>
              {
                errors.password?.message
              }
            </span>
          </div>


          <div className="inputdiv">
            {/* <button className='singup'>SIGN IN</button> */}
            <input type="submit" value="SIGN IN" className='singin' />
          </div>

          <div className="inputdiv"><p style={{ color: "black" }}> <Link to="/">Back To Home</Link>| Don't have an account?</p></div>
          <div style={{ marginLeft: "20px", gap: "20px" }}><Link to="/register">Register Here</Link>
            <Link to="/forgot" style={{ marginLeft: "60px" }}>Forgot Password</Link>
          </div>

        </div>
      </form>
    </div>
  )
}
