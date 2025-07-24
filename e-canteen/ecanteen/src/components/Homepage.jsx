import React from 'react'
import '../assets/homepage.css'
import { Link } from 'react-router-dom';

export const Homepage = () => {
  return (
    <div >
        <div className="navbar" >
        {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXiqw6XSn1fG2lTdYvPmgkIQ3VTFq0m0GgotfBX6V2pv2w3eTt95KgbcE93RiQOITMiWY&usqp=CAU" alt="" style={{height:"30px", width:'30px'}} /> */}
        <strong style={{color:'#fea116',fontSize:'30px'}}>E-canteen</strong>
        {/* <strong>Login</strong>
        <strong>register</strong> */}
        </div>
        <div className="containar">
        <h1>Welcome to a </h1>
        <h1>digital</h1>
        <h1>E-Canteen</h1>
        <h1> experience</h1>
        <button><a href="http://localhost:3001/login">  LOGIN</a></button>

        {/* <button> <Link to="/login" style={{ textDecoration: 'none' }}>LOGIN</Link> */}
        {/* </button>        */}
        {/* <button><Link to="/register" style={{ textDecoration: 'none' }}>REGISTER</Link></button> */}
        <button><a href="http://localhost:5173/register">REGISTER</a></button>
        </div>
        
    </div>
  )
}
