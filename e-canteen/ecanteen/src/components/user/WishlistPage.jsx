import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bounce, toast, ToastContainer } from 'react-toastify';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setLoading(true);
        

        const userId=localStorage.getItem("id") 
        // console.log(userId)
        const response = await axios.get(`/wishlist/${userId}`);
        console.log(response.data)
     
        setWishlistItems(response.data)
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch wishlist items. Please try again later.');
        setLoading(false);
        console.error('Error fetching wishlist items:', err);
      }
    };
    
    fetchWishlistItems();
  }, []);

 
  const handleRemoveFromWishlist = async(id) => {
    
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
    
    //  remove item from the backend
   const deletewishlist= await axios.delete(`/wishlist/${id}`);
  };

  const handleAddToCart = async(productId) => {
    // In production, add item to cart in the backend
    console.log(`Added product ${productId} to cart`);

    const userId = localStorage.getItem("id");
    
    try{
      const addtocart=await axios.post('/cart', { productId, quantity: 1,userId });
    toast.success('added to cart Successfully...');
   
    }catch(err){
      if (err.response && err.response.status === 400) {
       
        toast.warning("Product is already in your Cart!")
    } else {
        alert("Something went wrong. Please try again.");
    }
    }
     
  };

  const handleClearWishlist = async() => {
    setWishlistItems([]);
    const userId=localStorage.getItem("id")
    console.log(userId)
   const deletewishlist= await axios.delete(`/wishlist/all/${userId}`);
   console.log(deletewishlist)
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
    <div className="wishlist-page">

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
        transition={Bounce}
        />
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-3">Your Wishlist</h1>
          <p className="text-muted">Save items you love for later</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="card shadow-sm mb-4">
          <div className="card-body text-center py-5">
            <i className="bi bi-heart fs-1 text-muted mb-3"></i>
            <h3 className="h4 mb-3">Your wishlist is empty</h3>
            <p className="text-muted mb-4">Browse our products and add items you love to your wishlist!</p>
            <Link to="/user/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Wishlist Items ({wishlistItems.length})</h5>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleClearWishlist}
                >
                  Clear Wishlist
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  {wishlistItems.map(item => (
                    <div key={item._id} className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100 shadow-sm product-card">
                        <div className="position-relative">
                          <img
                            src={item.productId?.productImageURL1}
                            className="card-img-top"
                            alt={item.productId?.productName}
                            style={{ height: '180px', objectFit: 'cover' }}
                          />
                           {item.productId.offerPercentage > 0 && (
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge bg-danger">
                          {item.productId.offerPercentage}% OFF
                        </span>
                      </div>
                    )}
                          <button
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                            onClick={() => handleRemoveFromWishlist(item._id)}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <span className="badge bg-secondary">{item.productId.category}</span>
                            <div className="text-warning">
                              <i className="bi bi-star-fill"></i>
                              <span className="ms-1">{item.rating}</span>
                            </div>
                          </div>
                          <h5 className="card-title">
                            <Link to={`/user/products/${item.productId}`} className="text-decoration-none text-dark">
                              {item.productId?.productName}
                            </Link>
                          </h5>
                          <p className="card-text text-muted small mb-3">{item.description}</p>
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <span className="text-decoration-line-through text-muted me-2">₹{item.productId?.basePrice?.toFixed(2)}</span>
                                <span className="fw-bold text-primary">₹{item.productId?.offerPrice?.toFixed(2)}</span>
                              </div>
                              {!item.productId?.inStock && (
                                <span className="badge bg-danger">Out of Stock</span>
                              )}
                            </div>  
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => handleAddToCart(item.productId?._id)}
                              disabled={!item.productId?.inStock }
                            >
                              {item.productId?.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-12">
            <div className="d-flex justify-content-between">
              <Link to="/user/products" className="btn btn-outline-primary">
                <i className="bi bi-arrow-left me-2"></i>
                Continue Shopping
              </Link>
              <Link to="/user/cart" className="btn btn-primary">
                View Cart
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 