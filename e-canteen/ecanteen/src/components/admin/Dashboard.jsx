import axios from "axios";
import React from "react";
// import "../admin/AdminNavbar.css";
// import "../admin/AdminSidebar.css";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getdata()
    
  }, []);
  const getdata=async()=>{
   
    const res=await axios.get("/users/")
    console.log("Get all users",res.data.data)
    setStats(res.data.data)

    const res2=await axios.get("/orderdetail/all")
    console.log("Get all orders",res2.data)
    setOrders(res2.data)
  
  } 
  

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-primary mb-3">Admin Dashboard</h2>
          <p className="text-muted">Welcome to your dashboard overview</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Users Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow h-100">
            <div className="card-body m-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-muted mb-0">Total Users</h5>
                {/* <div className="bg-primary bg-opacity-10 p-2 rounded">
                  <i className="bi bi-people text-primary"></i>
                </div> */}
              </div>
              <h2 className="mb-0 text-primary">{stats.length}</h2>
              <p className="text-muted small mb-0 mt-2">Registered users in the system</p>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body m-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-muted mb-0">Total Orders</h5>
                {/* <div className="bg-success bg-opacity-10 p-2 rounded">
                  <i className="bi bi-cart text-success"></i>
                </div> */}
              </div>
              <h2 className="mb-0 text-success">{orders.length}</h2>
              <p className="text-muted small mb-0 mt-2">Total orders received</p>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body m-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-muted mb-0">Total Revenue</h5>
                  {/* <div className="bg-warning bg-opacity-10 p-2 rounded">
                    <i className="bi bi-currency-dollar text-warning"></i>
                  </div> */}
              </div>
              <h2 className="mb-0 text-warning">
                ₹{orders.reduce((total, order) => total + order.total, 0).toFixed(2)}
              </h2>
              <p className="text-muted small mb-0 mt-2">Total revenue generated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;