import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
   const [userId, setUserId] = useState();
  
  useEffect(() => {
    const id = localStorage.getItem("id");
    setUserId(id);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("id");
       
        const cartResponse = await axios.get(`/cart/${userId}`);
        console.log("cartResponse",cartResponse)

       
        const addressesResponse = await axios.get(`/address/user/${userId}`);
        console.log(addressesResponse.data.data)
      
        setCartItems(cartResponse.data);
        setAddresses(addressesResponse.data.data);
        
        // Set default address if available

        const defaultAddress = addressesResponse.data.data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load checkout information. Please try again later.');
        setLoading(false);
        console.error('Error loading checkout information:', err);
      }
    };
    
    fetchData();
  }, []);

  // Calculate order totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.productId.offerPrice* item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // Assuming 10% tax
  };


    const handleApplyCoupon = () => {
    
    if (couponCode.toLowerCase() === 'bapasitaram') {
      setCouponApplied(true);
      setDiscount(110);
    } else if (couponCode.toLowerCase() === 'mandip') {
      setCouponApplied(true);
      setDiscount(20);
    } else {
      alert('Invalid coupon code');
    }
  };
  const calculateDiscountAmount = () => {
   
    return couponApplied ? (calculateSubtotal() * (discount / 100)) : 0;
  };
  console.log(calculateDiscountAmount)

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 500 ? 0 : 35; 
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee() - calculateDiscountAmount();
  };

  const handlePlaceOrder = async () => {
    try {
      if (!selectedAddress) {
        alert('Please select a delivery address');
        return;
      }

      if (!paymentMethod) {
        alert('Please select a payment method');
        return;
      }
      const userID=localStorage.getItem("id")

// data is you wont to send in backend 
     
      const response = await axios.post('/orderdetail/add', {
        userId: userID,
        addressId: selectedAddress,
        paymentMethod,
        items: cartItems,
        total: calculateTotal(),
        discount: calculateDiscountAmount(),
        deliveryFee: calculateDeliveryFee(),
        tax: calculateTax(),
        Subtotal:calculateSubtotal()
      });
        console.log(response)

  // status is set ordered
  const orderId = response.data.data._id; 
  console.log(orderId)
     const res = await axios.post('/order/',{
      userId: userID,
      status:"ordered",
      orderId:orderId
     })

     console.log(res)

      console.log('Order placed successfully!');
      
      // Navigate to order confirmation or order history page
      navigate('/user/orders');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
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

  if (cartItems.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
          <h3 className="h4 mb-3">Your cart is empty</h3>
          <p className="text-muted mb-4">Add some items to your cart to proceed with checkout.</p>
          <Link to={userId ? `/user/${userId}/products` : "/login"} className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-3">Checkout</h1>
          <p className="text-muted">Complete your order</p>
        </div>
      </div>

      <div className="row">
        {/* Delivery Address and Payment Method */}
        <div className="col-lg-8 mb-4">
          {/* Delivery Address */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Delivery Address</h5>
            </div>
            <div className="card-body">
              {addresses.length === 0 ? (
                <div className="text-center py-3">
                  <p className="mb-3">No addresses found</p>
                  <Link to={userId ? `/user/${userId}/addresses` : "/login"} className="btn btn-primary">
                    Add New Address
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="row g-3">
                    {addresses.map(address => (
                      <div key={address._id} className="col-md-6">
                        <div 
                          className={`card ${selectedAddress === address ? 'border-primary' : 'border'}`}
                          onClick={() => setSelectedAddress(address)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                              <h6 className="mb-0">{address.addressType}</h6>
                              {address.isDefault && (
                                <span className="badge bg-primary ms-2">Default</span>
                              )}
                            </div>
                            <p className="mb-0 small">
                              {address.addressLine1} ,{address.addressLine2}<br />
                              {address.city.name}, {address.state.name},  {address.pincode}       
                              
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Link to={userId ? `/user/${userId}/addresses` : "/login"} className="btn btn-outline-primary">
                      Add New Address
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Payment Method</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div 
                    className={`card ${paymentMethod === 'card' ? 'border-primary' : 'border'}`}
                    onClick={() => setPaymentMethod('card')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-credit-card fs-4 me-2"></i>
                        <div>
                          <h6 className="mb-0">Credit/Debit Card</h6>
                          <small className="text-muted">Pay securely with your card</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div 
                    className={`card ${paymentMethod === 'cash' ? 'border-primary' : 'border'}`}
                    onClick={() => setPaymentMethod('cash')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-cash fs-4 me-2"></i>
                        <div>
                          <h6 className="mb-0">Cash on Delivery</h6>
                          <small className="text-muted">Pay when you receive</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Order Items</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr className='ml-8'>
                      <th scope="col" className='text-center'>Product</th>
                      <th scope="col" className='text-center'>Price</th>
                      <th scope="col" className='text-center'>Quantity</th>
                      <th scope="col" className="text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item._id}>
                        <td className=''>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.productId.productImageURL1} 
                              alt={item.name} 
                              className="img-thumbnail " 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="text-center">{item.productId.productName}</h6>
                              {!item.productId.inStock && (
                                <span className="badge bg-danger">Out of Stock</span>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className='text-center'>₹{item.productId.offerPrice}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">₹{(item.productId.offerPrice * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (10%):</span>
                <span>₹{calculateTax().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee:</span>
                <span>
                  {calculateDeliveryFee() === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    `₹${calculateDeliveryFee()?.toFixed(2)}`
                  )}
                </span>
              </div>

              
              {couponApplied && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount ({discount}%):</span>
                  <span>-₹{calculateDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold text-primary">₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="mb-3">
                  <label htmlFor="couponCode" className="form-label">Coupon Code</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="couponCode"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || !couponCode}
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <div className="text-success small mt-2">
                      <i className="bi bi-check-circle me-1"></i>
                      Coupon applied successfully!
                    </div>
                  )}
                </div>
              <button 
                className="btn btn-primary w-100 mb-3"
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || !paymentMethod}
              >
                Place Order
              </button>

              <div className="text-center">
                <Link to={userId ? `/user/${userId}/cart` : "/login"} className="btn btn-link text-decoration-none">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 