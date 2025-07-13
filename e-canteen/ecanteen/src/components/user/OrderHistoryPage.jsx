import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [orderstatus, setorderstatus] = useState()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [enableReviews,setEnableReviews] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
         
        const userID=localStorage.getItem("id")
        const response = await axios.get(`/orderdetail/${userID}`);
        console.log("get the order",response.data)

        const res= await axios.get(`/order/${userID}`)
        console.log("get order status ",res.data)
         setorderstatus(res.data)
   

       {
        orderstatus?.map((status)=>{
            console.log(status.status)

            switch(status.status){
              case "ordered":{
                status.status='ordered',
                status.date= '2024-03-15T10:30:00',
                status.description= 'Order placed successfully'
              }

              case"confirmed":{
                status.status= 'confirmed',
                status.date= '2024-03-15T10:35:00',
                status.description= 'Order confirmed by restaurant'
              }

              case "preparing": {
                status.status= 'preparing',
                status.date= '2024-03-15T10:40:00',
                status.description= 'Food preparation started'
              }

              case "ready":{
                status.status= 'ready',
                status.date= '2024-03-15T11:00:00',
                status.description= 'Order ready for delivery'
              }

              case"delivered":{
                status.status= 'delivered',
                status.date= '2024-03-15T11:30:00',
                status.description= 'Order delivered successfully'
              }
            }
        })
       }



        
        console.log(response.data)
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
        console.error('Error fetching orders:', err);
      }
    };
    fetchSiteData()
    fetchOrders();
  }, []);

  const fetchSiteData = async () => {
    const res = await axios.get("/site/get");
    console.log(res.data.data);
    setEnableReviews(res.data.data[0].enableReviews)
   
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered':
        return 'secondary';
      case 'confirmed':
        return 'info';
      case 'preparing':
        return 'primary';
      case 'ready':
        return 'warning';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-3">Order History</h1>
          <p className="text-muted">Track and manage your orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-bag-x fs-1 text-muted mb-3"></i>
            <h3 className="h4 mb-3">No orders found</h3>
            <p className="text-muted mb-4">You haven't placed any orders yet.</p>
            <Link to="/user/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-12">
            {orders.map(order => {
              const orderStatus = orderstatus.find(status => status.orderId === order._id);
              return (
              <div key={order._id} className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">Order Id : {order._id.slice(-5)}</h5>
                      <p className="mb-0 small text-muted">
                        Placed on {formatDate(orderStatus.updatedAt)}
                      </p>
                    </div>
                    <div className="text-end">
                      <span className={`badge bg-${getStatusColor(orderStatus?.status)} mb-2 d-block`}>
                        {getStatusText(orderStatus?.status)}
                      </span>
                      <span className="fw-bold">₹{order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                 
                  <div className="mb-4">
                    <h6 className="mb-3">Order Status</h6>

                    <div className="progress">
                      {orderStatus.status === "confirmed" ? (
                        <div className="progress-bar" style={{ width: "24%" }}></div>
                      ) : orderStatus.status === "preparing" ? (
                        <div className="progress-bar" style={{ width: "50%" }}></div>
                      ) : orderStatus.status === "ready" ? (
                        <div className="progress-bar" style={{ width: "75%" }}></div>
                      ) : orderStatus.status === "delivered" ? (
                        <div className="progress-bar" style={{ width: "100%" }}></div>  
                       ): orderStatus.status === "ordered" ? (
                        <div className="progress-bar" style={{ width: "0%" }}></div>  
                       ): orderStatus.status === "Cancelled" ? (
                        <div className="progress-bar" style={{ width: "Cancelled" }}></div>  
                       ) : null}
                    </div>
                    {orderStatus.status === "delivered"? (
                      <p style={{ color: "black", marginTop: "10px", display:"flex", justifyContent:"end" }}>Order delivered successfully</p>
                    ):orderStatus.status === "confirmed"?(
                      <p style={{ color: "black", marginTop: "10px", display:"flex", justifyContent:"start" }}>Order confirmed by restaurant</p>
                    ):orderStatus.status === "preparing"?(
                      <p style={{ color: "black", marginTop: "10px", display:"flex", justifyContent:"center" }}>Food preparation started</p>
                    ):orderStatus.status === "ready"?(
                      <p  className='me-2' style={{ color: "black",display:"flex", justifyContent:"end"  }}>Order ready for delivery</p>
                    ):orderStatus.status === "ordered"?(
                      <p  className='me-2' style={{ color: "black",display:"flex", justifyContent:"start" }}>Order placed successfully</p>
                    ):orderStatus.status === "Cancelled"?(
                      <p  className='me-2' style={{ color: "red",display:"flex", justifyContent:"start" }}>Order cancelled</p>
                    ):null}

                  </div>



                  {/* Order Items */}
                  <div className="table-responsive mb-4">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Item</th>
                          <th scope="col">Price</th>
                          <th scope="col">Quantity</th>
                          <th scope="col" className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map(item => (
                          <tr key={item._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={item.productId.productImageURL1} 
                                  alt={item.productId.productName} 
                                  className="img-thumbnail me-3" 
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                                <div>
                                  <h6 className="mb-0">{item.productId.productName}</h6>
                                </div>
                              </div>
                            </td>
                            <td>₹{item.productId.offerPrice?.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td className="text-end">₹{(item.productId.offerPrice * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="row">
                    {/* Delivery Address */}
                    <div className="col-md-6 mb-4">
                        <h6 className="mb-3">Delivery Address</h6>
                        {order.addressId?.map((address, index) => (
                          <div className="card" key={index}>
                            <div className="card-body">
                              <h6 className="card-subtitle mb-2">{address.addressType}</h6>
                              <p className="card-text mb-0">
                                {address.addressLine1}, {address.addressLine2} <br />
                                {address.city?.name}, {address.state?.name} {address.city?.pinCode}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>


                    {/* Payment Details */}
                    <div className="col-md-6 mb-4">
                      <h6 className="mb-3">Payment Details</h6>
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Payment Method:</span>
                            <span className="text-capitalize">
                              {order.paymentMethod === 'card' ? (
                                <span>
                                  <i className="bi bi-credit-card me-2"></i>
                                  Credit/Debit Card
                                </span>
                              ) : (
                                <span>
                                  <i className="bi bi-cash me-2"></i>
                                  Cash on Delivery
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>total:</span>
                            <span>₹{order.Subtotal?.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Tax:</span>
                            <span>₹{order.tax?.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Delivery Fee:</span>
                            <span>
                              {order.deliveryFee === 0 ? (
                                <span className="text-success">Free</span>
                              ) : (
                                `₹${order.deliveryFee?.toFixed(2)}`
                              )}
                            </span>
                          </div>
                          {order.discount > 0 && (
                            <div className="d-flex justify-content-between mb-2 text-success">
                              <span>Discount:</span>
                              <span>-₹{order.discount?.toFixed(2)}</span>
                            </div>
                          )}
                          <hr />
                          <div className="d-flex justify-content-between">
                            <span className="fw-bold">Total:</span>
                            <span className="fw-bold text-primary">₹{order.total?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <div className='align-self-center'>
                    <Link 
                      to={`/user/reviews/add/${order._id}`} 
                      className={`btn btn-primary ${enableReviews ? '' : 'disabled'}`}
                      style={{ display: orderStatus.status === 'delivered' ? 'block' : 'none' }}
                      
                    >
                      Write a Review
                    </Link>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      Track Order
                    </button>
                    
                  </div>
                  <p style={{color:"red",textAlign:"end", display: orderStatus.status === 'delivered' ? 'block' : 'none'}}>{enableReviews ? "" : "Reviews are not allowed at this time."}</p>

                </div>
              </div>
              )
})}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage; 