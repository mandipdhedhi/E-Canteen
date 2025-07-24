import React, { useEffect, useState } from 'react'
import '../assets/registerpage.css'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export const Registerpage = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [enableRegistration,setEnableRegistration] = useState(true)


  useEffect(() => {   
   
    fetchSiteData()
  }, [])
  const fetchSiteData = async () => {
    const res = await axios.get("/site/get");
    console.log(res.data.data);
    setEnableRegistration(res.data.data[0].enableRegistration)
    console.log(res.data.data[0].enableRegistration)
  }


  const formvalidation = {
    namevalidation: {
      required: {
        value: true,
        message: "name is required"
      },
      minLength: {
        value: 5,
        message: "name is minimum 5 ch.."
      }

    },
    phoneValidation: {
      required: {
          value: true,
          message: "Phone number is required",
      },
      pattern: {
          value: /^[6-9]\d{9}$/, // Ensures 10-digit number starting with 6-9
          message: "Enter a valid 10-digit phone number",
      },
   },
    addressvalidation: {
      required: {
        value: true,
        message: "Address is required"
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

      if (data.password !== data.confirmPassword) {
        // alert("Passwords do not match");
        toast('Password and Confirm Password do not match!');
        return;

      }
      ;
      console.log(data)
      // admin role
      // data.roleId = "67c5c4d5e375b3c915fa4019"
      //user role
      data.roleId = "67c5c4e0e375b3c915fa401b"
      const res = await axios.post("/signup", data)
      console.log(res)

      if (res.status === 201) {
        // alert("Signup Successfully...");
        toast.success("Signup Successfully!", {
          position: "top-center",
          autoClose: 1500,
          transition: Bounce
        });
        
        navigate("/login")
      } else if (res.status === 200) {
        toast.warning("User already exists!")
      }

    } catch (err) {
      console.log(err)
      toast.error("An error occurred. Please try again!", {
        position: "top-center",
        autoClose: 1500,
        transition: Bounce
      });
    }

  };
  return (
    <div className='register-containar'>

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
        <div style={{ color: 'black' }} className="re-containar">
          <h4 style={{ margin: "20px" }}>Registration Form</h4>
          <p style={{ color: "black", marginLeft: "20px" }}>Please Fill up the form to Register</p>

          <div className='inputdiv'><input type="text" placeholder='enter name' {...register("name", formvalidation.namevalidation)} />
            <span>
              {
                errors.name?.message
              }
            </span>
          </div>

          <div className='inputdiv'><input type="text" placeholder='enter email' {...register("email", formvalidation.namevalidation)} />
            <span>
              {
                errors.email?.message
              }
            </span>
          </div>

          <div className='inputdiv'><input type="text" placeholder='Phone' {...register("phone", formvalidation.phoneValidation)} />
            <span>
              {
                errors.phone?.message
              }
            </span>
          </div>

          <div className="inputdiv">
            <label style={{ color: 'black' }}>Select Canteen</label>
            <select  style={{ color: 'black' }} {...register("canteen")}> 
              <option value="Jodhapur" >Jodhapur</option>
            </select>
          </div>


          {/* <div className="inputdiv">
            <select {...register("roleId")}>
              <option value="67c5c4e0e375b3c915fa401b">customer</option>
              <option value="67d037fd2980706e05889947">ServiceProvider</option>
            </select>
          </div>
           */}

          <div className="inputdiv">
            <input type="password" placeholder='Password' {...register("password", formvalidation.passwordvalidation)} />
            <span>
              {errors.password?.message}
            </span>
          </div>

          <div className="inputdiv">
            <input type="password" placeholder='confirm Password' {...register("confirmPassword", formvalidation.passwordvalidation)} />
          </div>




          <div className="inputdiv">
            {/* <button className='singup'>SIGNUP</button> */}
            <input  type="submit" disabled={!enableRegistration} style={{backgroundColor:enableRegistration ? "" : "gray"}} value="SIGNUP" className='singup' />
            <p style={{color:"red"}}>{enableRegistration ? "" : "Registration is not allowed at this time."}</p>
          </div>

          <div className="inputdiv"><p style={{ color: "black" }}>Already have an account?<Link to="/login">Sign in</Link></p></div>
          
        </div>
      </form>
    </div>
  )
}
