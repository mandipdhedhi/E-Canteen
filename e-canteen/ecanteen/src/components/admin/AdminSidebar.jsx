import { Link } from "react-router-dom";
import "./AdminSidebar.css"; // Importing the CSS file

const AdminSidebar = ({ isSidebarOpen }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-menu" style={{color:"black"}}>
       
        <div className="menu-item" style={{marginTop:"15px"}}>
          <Link to="userdata" style={{color:"black"}}>User Management</Link>
        </div>
        <div className="menu-item">
          <Link to="category" style={{color:"black"}}>Category Management</Link>
        </div>
        <div className="menu-item">
          <Link to="productmanage" style={{color:"black"}}>Product Management</Link>
        </div>
        <div className="menu-item">
          <Link to="order" style={{color:"black"}}>Order Management</Link>
        </div>
        <div className="menu-item">
          <Link to="city" style={{color:"black"}}>State & City Management</Link>
        </div>
        <div className="menu-item">
              <Link to="review" style={{color:"black"}}>Reviews & Ratings</Link>
        </div>
        {/* <div className="menu-item">
          <Link to="reports" style={{color:"black"}}>Reports & Analytics</Link>
        </div> */}
        <div className="menu-item">
          <Link to="settings" style={{color:"black"}}>Settings</Link>
        </div>
       
      </div>
    </div>
  );
};

export default AdminSidebar;
