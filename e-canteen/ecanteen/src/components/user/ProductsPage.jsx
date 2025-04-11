import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bounce, toast, ToastContainer } from 'react-toastify';


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('name-asc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
      
        const response = await axios.get('/product/');
        console.log("get products",response.data)
        
       if (response.data && response.data) {
          setProducts(response.data);
        }
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };
    
    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Filter by category
      if (selectedCategory !== 'all' && product.categoryId?.name !== selectedCategory) {
        return false;
      }
      
      // Filter by price range
      if (product.offerPrice < priceRange.min || product.offerPrice > priceRange.max) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !product.productName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const nameA = a?.productName|| ''; // Ensure a default empty string
      const nameB = b?.productName|| ''; // Ensure a default empty string
    
      switch (sortBy) {
        case 'name-asc':
          return nameA.localeCompare(nameB);
        case 'name-desc':
          return nameB.localeCompare(nameA);
        case 'price-asc':
          return (a?.offerPrice?? 0) - (b?.offerPrice?? 0);
        case 'price-desc':
          return (b?.offerPrice?? 0) - (a?.offerPrice?? 0);
        case 'rating-desc':
          return (b?.rating ?? 0) - (a?.rating ?? 0);
        default:
          return 0;
      }
    });
    
  const handleAddToCart = async(productId) => {
    console.log(`Added productId ${productId} to cart`);
    const userId = localStorage.getItem("id");
    
    try{
      const addtocart=await axios.post('/cart', { productId, quantity: 1,userId });
     
    toast.success('added Successfully...');
   
    }catch(err){
      if (err.response && err.response.status === 400) {
        toast.success('Product is already in your Cart!')
    } else {
        alert("Something went wrong. Please try again.");
    }
    }
  };

  const handleAddToWishlist = async(productId) => {
    const userId = localStorage.getItem("id");
    console.log(`Added product ${productId} to wishlist`);
     
    try {
      const response = await axios.post('/wishlist', { productId, userId });
      toast.success("Successfully added to wishlist!")
  } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.success("Product is already in your wishlist!")
      } else {
          alert("Something went wrong. Please try again.");
      }
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

  return (
    <div className="products-page">
     
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
          <h1 className="mb-3">All Products</h1>
          <p className="text-muted">Browse our delicious food and beverages</p>
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 mb-4">
         <div className="collapse mt-2" id="collapseExample">
          <div className="card card-body">
            This is a collapsible section using Bootstrap in React.
          </div>
        </div>
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Filters</h5>
              
              {/* Search */}
              <div className="mb-3">
                <label htmlFor="search" className="form-label">Search</label>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Category Filter */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  className="form-select"
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {/* {categories.map(category => (
                    <option key={category.categoryId?._id} value={category.categoryId?.name}>
                      {category.categoryId?.name}
                    </option>
                  ))} */}
                  {[...new Map(categories.map(category => [category.categoryId?._id, category])).values()]
                    .map(uniqueCategory => (
                      <option key={uniqueCategory.categoryId?._id} value={uniqueCategory.categoryId?.name}>
                        {uniqueCategory.categoryId?.name}
                      </option>
                  ))}
               </select>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-3">
                <label className="form-label">Price Range</label>
                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className="form-control ms-2"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              {/* Sort By */}
              <div className="mb-3">
                <label htmlFor="sortBy" className="form-label">Sort By</label>
                <select
                  className="form-select"
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="rating-desc">Rating (Highest)</option>
                </select>
              </div>
              
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange({ min: 0, max: 1000 });
                  setSortBy('name-asc');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="col-lg-9">
          <div className="row">
            {filteredProducts.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info">
                  No products found matching your criteria. Try adjusting your filters.
                </div>
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm product-card">
                    <div className="position-relative">
                      
                      <img
                        src={product.productImageURL1}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                      <button
                        className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                        onClick={() => handleAddToWishlist(product._id)}
                      >
                        <i className="bi bi-heart"></i>
                      </button>
                      {product.offerPercentage > 0 && (
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge bg-danger">
                          {product.offerPercentage}% OFF
                        </span>
                      </div>
                    )}
                    </div>
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="badge bg-secondary">{product.categoryId?.name}</span>
                        <div className="text-warning">
                          <i className="bi bi-star-fill"></i>
                          <span className="ms-1">{product.subCategoryId?.name || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <h5 className="card-title">
                        <Link to={`/user/products/₹{product.id}`} className="text-decoration-none text-dark">
                          {product.productName}
                        </Link>
                      </h5>
                      <p className="card-text text-muted small mb-3">{product.categoryId.description}</p>
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <div>
                          <span className="text-decoration-line-through text-muted me-2">₹{product.basePrice.toFixed(2)}</span>
                          <span className="fw-bold text-primary">₹{product.offerPrice.toFixed(2)}</span>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={!product.inStock}
                        >
                          {product.inStock? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 