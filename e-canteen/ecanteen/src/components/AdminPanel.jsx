import { useState } from "react";
import AdminNavbar from "./admin/AdminNavbar";
import AdminSidebar from "./admin/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <AdminNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        
         <main className={`main-content ${isSidebarOpen ? "ml-64" : "ml-0"}` } style={{marginTop:"80px"}}>
         <Outlet></Outlet></main>

      </div>
    </div>
  );
};

export default AdminPanel;
