import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer,Bounce } from 'react-toastify';

export const ResetPassword = () => {
    const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit , formState:{errors} } = useForm();

  const submitHandler = async (data) => {
    console.log({
        token,
        password: data.password,
      })
    try {
      const res = await axios.post("/resetpassword", {
        token,
        password: data.password,
      });

      console.log("Response reset:", res);

      toast.success("Password reset successful!", {
        position: "top-center",
        autoClose: 2000,
        transition: Bounce,
      });

      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (err) {
      toast.error("Error resetting password", {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });
      console.error("Reset password error:", err.response?.data || err.message);
    }
  };
    const formvalidation={
        passwordvalidation:{
          required:{
            value: true,
            message:"password is required..."
          }
        }
       }
  return (
    <div className='forgot-containt'>
        <ToastContainer />
        <form onSubmit={handleSubmit(submitHandler)}>
            <div >
            <div className='forgot-div'><b>Reset Password</b></div>
            <div className='forgot-div'><input type="text" placeholder='New Password...' {...register("password",formvalidation.passwordvalidation)} />
            <span>
              {
                errors.password?.message
              }
            </span>
            </div>
            <input type="Submit" value="Reset" className='forgot-div' style={{backgroundColor:"#fea116"}} />
            </div>
        </form>
            <div className="inputdiv" style={{marginLeft:"10px",gap:"40px"}}><a href="http://localhost:5173/">| Back To Home </a><a href="http://localhost:5173/login" style={{marginLeft:"40px"}}>| Sign in</a></div>

    </div>
  )
}
