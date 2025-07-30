import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isdisable, setisdisable] = useState(false)

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
      
        const userId = localStorage.getItem("id");
        
        // console.log(userId)
        const response = await axios.get(`/cart/6886f2022918e10fe2e6ef00`);
        console.log(response.data)
    
       setCartItems(response.data);
        setLoading(false);

      } catch (err) {
        setError('Failed to fetch cart items. Please try again later.');
        setLoading(false);
        console.error('Error fetching cart items:', err);
      }
    };
    
    fetchCartItems();
  }, []);

  const handleQuantityChange = async(_id, newQuantity) => {
    if (newQuantity < 1) return;
   
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === _id ? { ...item, quantity: newQuantity } : item
      )
    );
   
    console.log(newQuantity)
    console.log(_id)
    const updatequantity = await axios.put(`/cart/${_id}`, { quantity: newQuantity });
  };
   
  useEffect(()=>{
    {cartItems?.map((item)=>(
      !item.productId.inStock && (setisdisable(true))  
))}
  },[cartItems])

  // remove items in cart
  const handleRemoveItem = async(_id) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== _id));
    
     const removeCartById=await axios.delete(`/cart/${_id}`);
  };

  const handleClearCart = async() => {
    setCartItems([]);
    const userId = localStorage.getItem("id");
   
    const removeCart=await axios.delete(`/cart/all/${userId}`);
    
  };



  const handleProceedToCheckout = () => {
      navigate('/user/checkout');
  };

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.productId.offerPrice * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // Assuming 10% tax
  };

  const calculateDiscountAmount = () => {
    return couponApplied ? (calculateSubtotal() * (discount / 100)) : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscountAmount();
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
    <div className="cart-page">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-3">Your Cart</h1>
          <p className="text-muted">Review and modify your items before checkout</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="card shadow-sm mb-4">
          <div className="card-body text-center py-5">
            <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
            <h3 className="h4 mb-3">Your cart is empty</h3>
            <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/user/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cart Items ({cartItems.length})</h5>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Subtotal</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={item.productId?.productImageURL1} 
                                alt={item.productId?.productName} 
                                className="img-thumbnail me-3" 
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              />
                              <div>
                                <Link to={`/user/products/₹{item.productId._id}`} className="text-decoration-none">
                                  <h6 className="mb-0">{item.productId. productName}</h6>
                                </Link>
                                {!item.productId.inStock && (
                                  <span className="badge bg-danger">Out of Stock</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>₹{item.productId.offerPrice }</td>
                          <td>
                            <div className="input-group" style={{ width: '120px' }}>
                              <button 
                                className="btn btn-outline-secondary btn-sm" 
                                type="button"
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <input 
                                type="text" 
                                className="form-control form-control-sm text-center" 
                                value={item.quantity}
                                onChange={() => handleQuantityChange(item._id, item.quantity)}
                                min="1"
                              />
                              <button 
                                className="btn btn-outline-secondary btn-sm " 
                                type="button"
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td>₹{(item.productId.offerPrice * item.quantity)}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveItem(item._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-between">
              <Link to="/user/products" className="btn btn-outline-primary mt-3">
                <i className="bi bi-arrow-left me-2"></i>
                Continue Shopping
              </Link>
       
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm mb-4">
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
               
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold text-primary">₹{calculateTotal().toFixed(2)}</span>
                </div>
                
 
            <button 
                className="btn btn-primary"
                onClick={handleProceedToCheckout}
                disabled={isdisable} >
                Proceed to Checkout
                <i className="bi bi-arrow-right ms-2"></i>
                
              </button>
              </div>
              
            </div>
            
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="mb-3">We Accept</h6>
                <div className="d-flex gap-2 mb-3">
                  <i className="bi bi-credit-card fs-3 text-primary"></i>
                  <i className="bi bi-paypal fs-3 text-primary"></i>
                  <i className="bi bi-wallet2 fs-3 text-primary"></i>
                </div>
                <div className="small text-muted">
                  <p className="mb-2">
                    <i className="bi bi-shield-check me-2"></i>
                    Secure payment processing
                  </p>
                  <p className="mb-0">
                    <i className="bi bi-arrow-return-left me-2"></i>
                    Easy 30-day returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 