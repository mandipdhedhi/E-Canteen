import React, { useState } from 'react'
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';




export const AdminNavbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
   
   

  return (
    
  <div>
   
      <nav className="navbar fixed-top" style={{backgroundColor:' rgb(135, 165, 176)'}}>
     <div style={{display:"flex",justifyContent:"center",alignItems:'center'}}>
     <button
  className="btn btn-outline"
  style={{
    width: "50px",
    height: "20px",
    borderRadius: "12px",
 // Green
    border: "none",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease-in-out",
  }}
  onClick={() => {
    setIsSidebarOpen(!isSidebarOpen);
  }}
  onMouseDown={(e) => (e.target.style.transform = "scale(0.9)")}
  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
><Menu size={28} />
</button>
    <h2 className="navbar-title">Admin Panel</h2>
    </div>

    <div className="navbar-links">
     <span> <Link to="dashboard" style={{color:"black", marginRight:"10px"}}>Dashboard</Link></span>
      <span> <Link to="addadmin" style={{color:"black", marginRight:"10px"}}>New Admin </Link></span>
      {/* <span> <Link to="#about" style={{color:"black", marginRight:"10px"}}>About Us</Link></span> */}
      
     <span >
       <Link to="/user/logout">
       <FontAwesomeIcon icon={faSignOutAlt} style={{ marginLeft: "10px", marginRight:"15px", fontSize: "20px", cursor: "pointer" }} />
       </Link>
     </span>
      
      
    </div>
  </nav>
  </div>
  )
}
export default AdminNavbar; 