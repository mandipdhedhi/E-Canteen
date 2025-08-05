import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState();
  
  useEffect(() => {
    const id = localStorage.getItem("id");
    setUserId(id);
  }, []);
  

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // For now, using mock data - in production, replace with API calls
        // Example: const response = await axios.get(`/api/products/${productId}`);
        
        // Mock product data
        const mockProduct = {
          id: parseInt(productId),
          name: 'Chicken Burger',
          description: 'Delicious chicken burger with fresh vegetables and special sauce. Made with 100% organic chicken breast, fresh lettuce, tomatoes, and our signature mayo sauce.',
          price: 8.99,
          images: [
            'https://via.placeholder.com/600x400',
            'https://via.placeholder.com/600x400',
            'https://via.placeholder.com/600x400'
          ],
          category: 'Fast Food',
          rating: 4.5,
          reviewCount: 24,
          inStock: true,
          nutritionalInfo: {
            calories: 450,
            protein: '22g',
            carbs: '35g',
            fat: '22g'
          },
          ingredients: [
            'Chicken breast',
            'Lettuce',
            'Tomato',
            'Onion',
            'Cheese',
            'Special sauce',
            'Sesame bun'
          ],
          allergens: ['Gluten', 'Dairy', 'Eggs'],
          preparationTime: '15 minutes'
        };
        
        // Mock related products
        const mockRelatedProducts = [
          {
            id: 2,
            name: 'Vegetable Pizza',
            description: 'Fresh vegetable pizza with mozzarella cheese',
            price: 12.99,
            image: 'https://via.placeholder.com/300',
            category: 'Pizza',
            rating: 4.2
          },
          {
            id: 5,
            name: 'French Fries',
            description: 'Crispy french fries with ketchup',
            price: 3.99,
            image: 'https://via.placeholder.com/300',
            category: 'Sides',
            rating: 4.3
          },
          {
            id: 6,
            name: 'Iced Coffee',
            description: 'Refreshing iced coffee with milk',
            price: 3.49,
            image: 'https://via.placeholder.com/300',
            category: 'Beverages',
            rating: 4.1
          }
        ];
        
        // Mock reviews
        const mockReviews = [
          {
            id: 1,
            userName: 'John Doe',
            rating: 5,
            date: '2023-05-15',
            comment: 'Absolutely delicious! The chicken was perfectly cooked and the sauce was amazing.',
            avatar: 'https://via.placeholder.com/50'
          },
          {
            id: 2,
            userName: 'Jane Smith',
            rating: 4,
            date: '2023-05-10',
            comment: 'Very good burger, but could use a bit more sauce. Otherwise perfect!',
            avatar: 'https://via.placeholder.com/50'
          },
          {
            id: 3,
            userName: 'Mike Johnson',
            rating: 5,
            date: '2023-05-05',
            comment: 'Best burger I\'ve had in a long time. Will definitely order again!',
            avatar: 'https://via.placeholder.com/50'
          }
        ];
        
        setProduct(mockProduct);
        setRelatedProducts(mockRelatedProducts);
        setReviews(mockReviews);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details. Please try again later.');
        setLoading(false);
        console.error('Error fetching product details:', err);
      }
    };
    
    fetchProductData();
    // Reset quantity when product changes
    setQuantity(1);
    // Reset active tab when product changes
    setActiveTab('description');
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [productId]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // In production, implement cart functionality with API
    console.log(`Added ${quantity} of product ${productId} to cart`);
    // Example: await axios.post('/api/cart/add', { productId, quantity });
  };

  const handleAddToWishlist = () => {
    // In production, implement wishlist functionality with API
    console.log(`Added product ${productId} to wishlist`);
    // Example: await axios.post('/api/wishlist/add', { productId });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    
    return stars;
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

  if (error || !product) {
    return (
      <div className="alert alert-danger" role="alert">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/user/home">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/user/products">Products</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/user/products?category=${product.category}`}>{product.category}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Images */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="card-img-top img-fluid"
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <div className="card-body p-2">
              <div className="row g-2 mt-1">
                {product.images.map((image, index) => (
                  <div key={index} className="col-4">
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      className="img-thumbnail" 
                      style={{ height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h1 className="card-title h3 mb-2">{product.name}</h1>
              
              <div className="d-flex align-items-center mb-3">
                <div className="me-2">
                  {renderStars(product.rating)}
                </div>
                <span className="text-muted">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
              
              <h2 className="h4 text-primary mb-3">${product.price.toFixed(2)}</h2>
              
              <p className="card-text mb-4">{product.description}</p>
              
              <div className="d-flex align-items-center mb-4">
                <div className="input-group me-3" style={{ maxWidth: '150px' }}>
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={decrementQuantity}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={incrementQuantity}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                
                <button 
                  className="btn btn-primary me-2"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </button>
                
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleAddToWishlist}
                >
                  <i className="bi bi-heart"></i>
                </button>
              </div>
              
              <div className="mb-3">
                <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'} me-2`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="badge bg-info me-2">
                  <i className="bi bi-clock me-1"></i>
                  {product.preparationTime}
                </span>
                <span className="badge bg-secondary">
                  <i className="bi bi-tag me-1"></i>
                  {product.category}
                </span>
              </div>
              
              <hr />
              
              <div className="row g-2">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-truck text-primary me-2 fs-5"></i>
                    <span>Free delivery on orders over $20</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-arrow-return-left text-primary me-2 fs-5"></i>
                    <span>Easy 30-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'nutrition' ? 'active' : ''}`}
                onClick={() => setActiveTab('nutrition')}
              >
                Nutrition & Ingredients
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'description' && (
            <div>
              <h3 className="h5 mb-3">Product Description</h3>
              <p>{product.description}</p>
            </div>
          )}
          
          {activeTab === 'nutrition' && (
            <div>
              <h3 className="h5 mb-3">Nutritional Information</h3>
              <div className="row mb-4">
                <div className="col-md-6">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th>Calories</th>
                        <td>{product.nutritionalInfo.calories}</td>
                      </tr>
                      <tr>
                        <th>Protein</th>
                        <td>{product.nutritionalInfo.protein}</td>
                      </tr>
                      <tr>
                        <th>Carbohydrates</th>
                        <td>{product.nutritionalInfo.carbs}</td>
                      </tr>
                      <tr>
                        <th>Fat</th>
                        <td>{product.nutritionalInfo.fat}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <h3 className="h5 mb-3">Ingredients</h3>
              <ul className="list-group mb-4">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="list-group-item">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {ingredient}
                  </li>
                ))}
              </ul>
              
              <h3 className="h5 mb-3">Allergens</h3>
              <div className="mb-3">
                {product.allergens.map((allergen, index) => (
                  <span key={index} className="badge bg-warning text-dark me-2 mb-2">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <h3 className="h5 mb-3">Customer Reviews</h3>
              
              {reviews.length === 0 ? (
                <div className="alert alert-info">
                  No reviews yet. Be the first to review this product!
                </div>
              ) : (
                <div>
                  {reviews.map(review => (
                    <div key={review.id} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex mb-3">
                          <img 
                            src={review.avatar} 
                            alt={review.userName} 
                            className="rounded-circle me-3"
                            width="50"
                            height="50"
                          />
                          <div>
                            <h6 className="mb-1">{review.userName}</h6>
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                {renderStars(review.rating)}
                              </div>
                              <small className="text-muted">
                                {new Date(review.date).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </div>
                        <p className="mb-0">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center mt-4">
                    <Link to={`/user/reviews/add/${productId}`} className="btn btn-outline-primary">
                      Write a Review
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mb-4">
        <h3 className="h4 mb-3">You May Also Like</h3>
        <div className="row">
          {relatedProducts.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm product-card">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="badge bg-secondary">{product.category}</span>
                    <div className="text-warning">
                      <i className="bi bi-star-fill"></i>
                      <span className="ms-1">{product.rating}</span>
                    </div>
                  </div>
                  <h5 className="card-title">
                    <Link to={`/user/products/${product.id}`} className="text-decoration-none text-dark">
                      {product.name}
                    </Link>
                  </h5>
                  <p className="card-text text-muted small mb-3">{product.description}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">${product.price.toFixed(2)}</span>
                    <Link to={`/user/products/${product.id}`} className="btn btn-outline-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 