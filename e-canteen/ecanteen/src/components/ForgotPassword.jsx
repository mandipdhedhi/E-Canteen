import React from 'react'
import '../assets/img/login.css'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Link } from 'react-router-dom'


export const ForgotPassword = () => {

  const {register,handleSubmit,formState:{errors}}=useForm()

 const submithandler=async(data)=>{
  console.log(data);

  try {
    const res = await axios.post("/forgot", data);
    console.log(res);
  
    alert("Reset link sent to your email!");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        alert("User not found, please register first...");
      } else {
        alert("Something went wrong. Try again later.");
        console.error(error.response?.data);
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }
  
     
 }

 const formvalidation={
  emailvalidation:{
    required:{
      value: true,
      message:"email is required..."
    }
  }
 }
  return (
    <div className='forgot-containt'>
        <form onSubmit={handleSubmit(submithandler)}>
            <div >
            <div className='forgot-div'><b>Enter Your Email</b></div>
            <div className='forgot-div'><input type="text" placeholder='Email' {...register("email",formvalidation.emailvalidation)} />
            <span>
              {
                errors.email?.message
              }
            </span>
            </div>
            <input type="Submit" value="Forgot" className='forgot-div' style={{backgroundColor:"#fea116"}} />
            </div>
        </form>
            <div className="inputdiv" style={{marginLeft:"10px",gap:"40px"}}><Link to="/">| Back To Home </Link><Link to="/login" style={{marginLeft:"40px"}}>| Sign in</Link></div>

    </div>
  )
}

