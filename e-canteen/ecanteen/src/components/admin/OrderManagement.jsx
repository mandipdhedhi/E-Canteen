import axios from "axios";

import React, { useState, useEffect } from "react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [orderstatus, setorderstatus] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  
  useEffect(() => {

    const fetchOrders=async()=>{
      const response = await axios.get(`/orderdetail/all`);
      console.log(response);
      const res= await axios.get('/order/')
      console.log(res)

       setOrders(response.data);
       setorderstatus(res.data)
    }
 
    fetchOrders();
  }, []);

  // Filter orders based on search term, status, and date range
  const filteredOrders = orders.filter(order => {
    const orderStatus = orderstatus.find(status => status.orderId === order._id);
    const matchesSearch = 
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus ? orderStatus.status === filterStatus : true;
    
    const orderDate = new Date(orderStatus.updatedAt);
    // console.log(orderDate)
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;
    
    const matchesDateRange = 
      (!fromDate || orderDate >= fromDate) && 
      (!toDate || orderDate <= toDate);
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // View order details
  const handleViewOrder = (order) => {
    console.log(order)
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
   
  // Update order status
  const handleStatusChange = async(orderId, newStatus) => {
    try {
      // Update status in the API
      await axios.put(`/order/${orderId}`, {
        status: newStatus
      });

      // Fetch updated orders and status
      const [ordersResponse, statusResponse] = await Promise.all([
        axios.get('/orderdetail/all'),
        axios.get('/order/')
      ]);

      // Update state with fresh data
      setOrders(ordersResponse.data);
      setorderstatus(statusResponse.data);

      // Update selected order if modal is open
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = ordersResponse.data.find(order => order._id === orderId);
        setSelectedOrder(updatedOrder);
        console.log(selectedOrder)
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // You might want to add error handling UI here
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-md-4 p-3">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
        </div>
        
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="">All Statuses</option>
                <option value="ordered">ordered</option>
                <option value="confirmed">confirmed</option>
                <option value="preparing">preparing</option>
                <option value="ready">ready</option>
                <option value="delivered">delivered</option>
                <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <input
            type="date"
            placeholder="From"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="date"
            placeholder="To"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="w-1/2 p-2 border rounded"
          />
        </div>
      </div>
      
      {/* Orders Table - Desktop Only */}
      <div className="d-none d-md-block overflow-x-auto row">
       
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Status</th>
              {/* <th className="py-3 px-4 text-left">Payment</th> */}
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => {
                const orderStatus = orderstatus.find(status => status.orderId === order._id);
              return(
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{order._id.slice(-5)}</td>
                <td className="py-3 px-4">
                  {order.addressId?.map((address, index) => (
                    <div key={index}>
                       {address.fullName}
                    </div>
                  ))}
                </td>
                <td className="py-3 px-4">{formatDate(orderStatus.updatedAt)}</td>
                <td className="py-3 px-4">₹{order.total.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(orderStatus.status)}`}>
                    {orderStatus.status}
                  </span>
                </td>
                {/* <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.paymentStatus === "Paid" 
                      ? "bg-green-100 text-green-800" 
                      : order.paymentStatus === "Refunded"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td> */}
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="btn btn-primary h-10"
                    >
                      View
                    </button>
                    <select
                      value={orderStatus.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-sm border rounded p-1">
                       <option value="ordered">ordered</option>
                      <option value="confirmed">confirmed</option>
                      <option value="preparing">preparing</option>
                      <option value="ready">ready</option>
                      <option value="delivered">delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            )
            })}
            
          </tbody>
        </table>

        
      </div>

      {/* Orders Cards - Mobile Only */}
      <div className="d-block d-md-none space-y-4 ">
        {filteredOrders.map(order => {
          const orderStatus = orderstatus.find(status => status.orderId === order._id);
          return (
            <div key={order._id} className="bg-white rounded-lg shadow p-4 space-y-3 mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order._id.slice(-5)}</p>
                  <p className="font-medium">
                    {order.addressId?.map((address, index) => (
                      <span key={index}>{address.fullName}</span>
                    ))}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(orderStatus.status)}`}>
                  {orderStatus.status}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span>{formatDate(orderStatus.updatedAt)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">₹{order.total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  order.paymentStatus === "Paid" 
                    ? "bg-green-100 text-green-800" 
                    : order.paymentStatus === "Refunded"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              
              <div className="flex flex-col space-y-2 pt-2">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="btn btn-primary w-full"
                >
                  View Details
                </button>
                <select
                  value={orderStatus.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="w-full text-sm border rounded p-2">
                  <option value="ordered">ordered</option>
                  <option value="confirmed">confirmed</option>
                  <option value="preparing">preparing</option>
                  <option value="ready">ready</option>
                  <option value="delivered">delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          );
        })}
        
        {filteredOrders.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No orders found
          </div>
        )}
      </div>
      
      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Order Details: {selectedOrder.id}</h3>
                
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {selectedOrder.addressId?.map((address, index) => (
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p><span className="font-medium">Name:</span> {address.fullName}</p>
                  
                  <p><span className="font-medium">Phone:</span> {address.phone}</p>
                  <p><span className="font-medium">Address:</span> {address.addressLine1} , {address.addressLine2}</p>
                  <p><span className="font-medium">City:</span> {address.city.name}</p>
                </div>
                  ))}
                <div>
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.updatedAt)}</p>
                 
                  <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                  <p>
                    <span className="font-medium">Payment Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedOrder.paymentStatus === "Paid" 
                        ? "bg-green-100 text-green-800" 
                        : selectedOrder.paymentStatus === "Refunded"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                  {selectedOrder.notes && (
                    <p><span className="font-medium">Notes:</span> {selectedOrder.notes}</p>
                  )}
                </div>
              </div>
              
              <h4 className="font-semibold mb-2">Order Items</h4>
              <table className="min-w-full bg-white border rounded-lg mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Item</th>
                    <th className="py-2 px-4 text-right">Price</th>
                    <th className="py-2 px-4 text-right">Quantity</th>
                    <th className="py-2 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map(item => (
                    <tr key={item.id} className="border-t">
                      <td className="py-2 px-4">{item.productId.productName}</td>
                      <td className="py-2 px-4 text-right">₹{item.productId.offerPrice?.toFixed(2)}</td>
                      <td className="py-2 px-4 text-right">{item.quantity}</td>
                      <td className="py-2 px-4 text-right">₹{(item.productId.offerPrice * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="border-t font-semibold">
                    <td colSpan="3" className="py-2 px-4 text-right">Tax:</td>
                    <td className="py-2 px-4 text-right">₹{selectedOrder.tax.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t font-semibold">
                    <td colSpan="3" className="py-2 px-4 text-right">DeliveryFee:</td>
                    <td className="py-2 px-4 text-right">₹{selectedOrder.deliveryFee.toFixed(2)}</td>
                  </tr>

                  <tr className="border-t font-semibold">
                    <td colSpan="3" className="py-2 px-4 text-right">Total:</td>
                    <td className="py-2 px-4 text-right">₹{selectedOrder.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              
              <div className="flex justify-between">
                <div>
                  <label className="font-medium mr-2">Update Status:</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="border rounded p-2"
                  >
                      <option value="ordered">ordered</option>
                      <option value="confirmed">confirmed</option>
                      <option value="preparing">preparing</option>
                      <option value="ready">ready</option>
                      <option value="delivered">delivered</option>
                      <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;