import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify'

export const User = () => {
 

  const [users, setusers]=  useState()
  const [isshow, setisshow] = useState(false)
  const [isloader, setisloader] = useState()
 

  useEffect(()=>{
    getdata()
},[])

const getdata=async()=>{
  setisloader(true)
  const res=await axios.get("/users/")
  console.log(res)
  setusers(res.data.data)
  
  setisshow(true)
  setisloader(false)
} 

const deletedata=async(id)=>{
  // alert("your data delete ..")
  if (window.confirm('Are you sure you want to delete this user?')) {
    try {
      const res = await axios.delete("/user/" + id);
      console.log("User deleted successfully");
      getdata();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error('Failed to delete user');
    }
  }
  }



  return (
    
    <div className='p-4'>
        
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
        transition={Bounce}/>
        <h1 className=''>User List</h1>
<div className="card mb-4">
        <div className="card-body">
          <div className="table-responsive">
       <table className='table table-hover'>
            <thead >
                {isshow==true?<tr>
                   
                    <th>Name</th>
                    <th>
                        email
                    </th>
                    <th>Phone</th>
                   
                    
                    <th>Canteen</th>
                    <th>User ID</th>
                   
                    <th>Delete</th>
                </tr>:""}
            </thead>

            <tbody className='table-group-divider align-middle'>
                {
                    users?.map((user)=>{
                        return <tr>
                        
                        <th key={user._id}>{user.name}</th>
                        <th>{user.email}</th>
                        <th>{user.phone}</th>
                       
                        <th>{user.canteen}</th>

                        <th>{user._id}</th>

                        <th><button className='btn btn-danger' onClick={()=>{deletedata(user._id)}}>delete</button></th>
                    </tr>
                    })
                }
            </tbody>
        </table>
        </div>
        </div>
        </div>  
     
    </div>
  )
}
