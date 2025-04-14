import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

const styles = {
  container: {
    padding: '20px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '256px'
  },
  loadingSpinner: {
    animation: 'spin 1s linear infinite',
    borderRadius: '50%',
    height: '48px',
    width: '48px',
    borderTop: '2px solid #3B82F6',
    borderBottom: '2px solid #3B82F6'
  },
  heroSection: {
    marginBottom: '32px'
  },
  heroContent: {
    background: 'linear-gradient(to right, #3B82F6, #9333EA)',
    height: '256px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px'
  },
  heroTitle: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: 'black',
    marginBottom: '8px'
  },
  heroText: {
    color: 'black',
    fontSize: '1.125rem',
    marginBottom: '24px'
  },
  heroButton: {
    backgroundColor: 'white',
    color: '#2563EB',
    padding: '8px 24px',
    borderRadius: '9999px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'background-color 0.3s'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '24px'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '48px'
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s',
    textDecoration: 'none'
  },
  categoryImage: {
    width: '100%',
    height: '128px',
    objectFit: 'cover'
  },
  categoryName: {
    padding: '16px',
    textAlign: 'center',
    fontWeight: '600'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s'
  },
  productImage: {
    width: '100%',
    height: '192px',
    objectFit: 'cover'
  },
  productContent: {
    padding: '16px'
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  productTitle: {
    fontWeight: '600',
    fontSize: '1.125rem',
    marginBottom: '4px'
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#2563EB'
  },
  productDescription: {
    color: '#4B5563',
    fontSize: '0.875rem',
    marginBottom: '8px'
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px'
  },
  starFilled: {
    color: '#F59E0B',
    marginRight: '2px'
  },
  starEmpty: {
    color: '#D1D5DB',
    marginRight: '2px'
  },
  ratingText: {
    fontSize: '0.875rem',
    color: '#6B7280'
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px'
  },
  viewButton: {
    backgroundColor: '#ffa500',
    margin:"10px",
    color: 'white',
    padding: '16px 16px',
    borderRadius: '4px',
    fontSize: '0.875rem',
    textDecoration: 'none',
    flex: 1,
    textAlign: 'center',
    transition: 'background-color 0.3s'
  },
  cartButton: {
    backgroundColor: '#ffd700',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '0.875rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {


    const fetchData = async () => {
      try {
        const response = await axios.get('/product/');
        console.log(response.data)

        if (response.data && response.data) {
          setFeaturedProducts(response.data);
        }

      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchData();

    setIsLoading(false);
  }, []);


  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} style={styles.starFilled}>★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" style={styles.starFilled}>★</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={styles.starEmpty}>★</span>);
    }

    return stars;
  };

  const handleAddToCart = async (productId) => {
    // In production, add item to cart in the backend
    console.log(`Added product ${productId} to cart`);

    const userId = localStorage.getItem("id");

    try {
      const addtocart = await axios.post('/cart', { productId, quantity: 1, userId });
      toast.success('added Successfully...');

    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.warning('Product is already in your Cart!');

      } else {
        alert("Something went wrong. Please try again.");
      }
    }

  };
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (

    <div style={styles.container}>
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
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div>
            <h1 style={styles.heroTitle}>Welcome to E-Canteen</h1>
            <p style={styles.heroText}>Discover delicious meals and quick delivery</p>
            <Link to="/user/products" style={styles.heroButton}>
              Browse Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div>
        {/* <h2 style={styles.sectionTitle}>Categories</h2> */}
        <div style={styles.categoriesGrid}>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/user/products?category=${category.name}`}
              style={styles.categoryCard}
            >
              <img
                src={category.image}
                alt={category.name}
                style={styles.categoryImage}
              />
              <div style={styles.categoryName}>
                <h3>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        <div style={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <div key={product._id} className="position-relative">
              <img
                src={product.productImageURL1}
                alt={product.productName}
                style={styles.productImage}
              />
              {product.offerPercentage > 0 && (
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-danger">
                    {product.offerPercentage}% OFF
                  </span>
                </div>
              )}

              <div style={styles.productContent}>
                <div style={styles.productHeader}>
                  <h3 style={styles.productTitle}>{product.productName}</h3>
                  <span style={styles.productPrice}>
                    <div>
                      <span className="text-decoration-line-through text-muted me-2">₹{product.basePrice?.toFixed(2)}</span>
                      <span className="fw-bold text-primary">₹{product.offerPrice?.toFixed(2)}</span>
                    </div>
                  </span>
                </div>
                <p style={styles.productDescription}>{product.productDetail}</p>
                <div style={styles.ratingContainer} className="d-flex justify-content-between align-items-center mb-2">
                  <div>{renderStars(product.rating)}</div>
                  {/* <span style={styles.ratingText}>({product.rating})</span> */}
                  <span>
                    {!product.inStock && (
                      <span className="badge bg-danger">Out of Stock</span>
                    )}</span>
                </div>
                <div style={styles.buttonContainer}>
                  <Link
                    // to={`/user/products/${product._id}`}
                    to={`/user/products/`}
                    style={styles.viewButton}
                  >
                    View Details
                  </Link>

                  
                  <button
                    style={styles.cartButton}
                    onClick={() => handleAddToCart(product._id)}
                    title="Add to Cart"
                    disabled={!product.inStock}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ height: '20px', width: '20px' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 