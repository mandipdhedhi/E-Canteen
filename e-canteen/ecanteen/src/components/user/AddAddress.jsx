import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const AddAddress = () => {
  const [states, setstates] = useState([])
  const [citys, setcitys] = useState([])
  const [areas, setareas] = useState([])
  const { register, handleSubmit,formState:{errors} } = useForm();

  const submithandler = async(data) => {
    const userId=localStorage.getItem("id")
    data.userId=userId;
    console.log("User Address:", data);
   
     try{
      const res=await axios.post("/useraddress/adduseraddress",data);
      console.log(res)
       if(res.status===201){
      alert("user address added successfully...")
       }
     }catch(err){
      err:err
     }
  };

  const getState=async()=>{
    const res=await axios.get("/state");
    console.log("state object",res.data)
    setstates(res.data.data)
  }

  const getCityByStateId=async(id)=>{
    console.log(id)
    const res=await axios.get("/city/getcitybystate/"+id)
    console.log("city data: ",res)
    setcitys(res.data.data)

  }

  const getAreaByCity=async(id)=>{
    console.log("cityid",id)
    const res=await axios.get("/area/getareabycity/"+id)
    console.log("area data:",res)
    setareas(res.data.data)
  }

  useEffect(()=>{
     getState()
  },[])

  const formvalidation={
    title:{
        required:{
            value:true,
            message:"title is required"
        }
    },
    unitname:{
        required:{
            value:true,
            message:"unit name is required"
        }
    },
    streetaddress:{
        required:{
            value:true,
            message:"atreet address is required..."
        }
    },
    state:{
        required:{
            value:true,
            message:"state is required..."
        }
    },
    city:{
        required:{
            value:true,
            message:"city is required..."
        }
    },
     area:{
        required:{
            value:true,
            message:"area name is required..."
        }
    }, latitude:{
        required:{
            value:true,
            message:"latitude is required..."
        }
    },
    longitude:{
        required:{
            value:true,
            message:"longitude is required..."
        }
    },
    zipcode:{
        required:{
            value:true,
            message:"zipcode is required..."
        }
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">

      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "500px" }}>

        <h2 className="text-center mb-4">User Address Form</h2>

        <form onSubmit={handleSubmit(submithandler)}>

          <div className="mb-3">
            <label className="form-label">User Name</label>
            <input className="form-control" {...register("user",formvalidation.title)} />
          <span className="text-danger">  {
                errors.user?.message
            }
            </span> 
          </div>

          {/* <div className="mb-3">
            <label className="form-label">Unit Name</label>
            <input className="form-control" {...register("unitName",formvalidation.unitname)} />
            <span className="text-danger">
                {
                    errors.unitName?.message
                }
            </span>
          </div> */}

          <div className="mb-3">
            <label className="form-label">Street Address</label>
            <input className="form-control" {...register("street",formvalidation.streetaddress)} />
            <span className="text-danger">

                {
                    errors.street?.message
                }
            </span>
          </div>

          <div className="mb-3">
            <label className="form-label">Select State:</label>
            {/* <input className="form-control" {...register("stateId",formvalidation.state)} /> */}
            <select className="form-control" {...register("stateId")} onChange={(event)=>{getCityByStateId(event.target.value)}}>
               <option value="">Select State</option>
               {
                 states?.map((state)=>{
                    return <option value={state._id} key={state._id}>
                        {
                            state.name
                        }
                    </option>
                 })
               }

            </select>

            <span className="text-danger">
                {
                    errors.stateId?.message
                }
            </span>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Select City:</label>
            {/* <input className="form-control" {...register("cityId",formvalidation.city)} /> */}
            <select className="form-control" {...register("cityId")} onChange={(event)=>{getAreaByCity(event.target.value)}}>
              <option value="">Select </option>
              {
                 citys?.map((city)=>{
                  return <option key={city._id} value={city._id}>
                    {
                      city.name
                    }
                  </option>
                 })
              }
            </select>
            <span className="text-danger">
                {
                    errors.cityId?.message
                }
            </span>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Area</label>
            {/* <input className="form-control" {...register("areaId",formvalidation.area)} /> */}
            <select className="form-control" {...register("areaId")}>
              <option value="">Select</option>
              {
                areas?.map((area)=>{
                  return <option value={area._id} key={area._id}>
                    {
                      area.name
                    }
                  </option>
                })
              }
            </select>

            <span className="text-danger">
                {
                    errors.areaId?.message
                }
            </span>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Latitude</label>
            <input type="number" step="any" className="form-control" {...register("latitude",formvalidation.latitude)} />
            <span className="text-danger">
                {
                    errors.latitude?.message
                }
            </span>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Longitude</label>
            <input type="number" step="any" className="form-control" {...register("longitude",formvalidation.longitude)} />
            <span className="text-danger">
                {
                    errors.longitude?.message
                }
            </span>
          </div>
          
          <div className="mb-3">
            <label className="form-label">ZIP Code</label>
            <input className="form-control" {...register("zipcode",formvalidation.zipcode)} />
            <span className="text-danger">
                {
                    errors.zipcode?.message
                }
            </span>
          </div>
          
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};
