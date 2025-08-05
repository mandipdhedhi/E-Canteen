import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState();

useEffect(() => {
  const id = localStorage.getItem("id");
  setUserId(id);
}, []);


  // React Hook Form setup
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      rating: 5,
      reviewText: ''
    }
  });

  // Form state for new/edit review
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  useEffect(() => {
    // Check if we're on the add review route
    const isAddReviewRoute = location.pathname.includes('/reviews/add');
    
    if (isAddReviewRoute) {
      // If we don't have an orderId, redirect to orders page
      if (!orderId) {
        navigate('/user/orders');
        return;
      }
      setIsAddingNew(true);
      fetchOrderDetails();
    }
    
    fetchReviews();
  }, [location.pathname, orderId, navigate]);

  const fetchOrderDetails = async () => {
    if (!orderId) {
      navigate('/user/orders');
      return;
    }
    
    try {
      const response = await axios.get(`/orderdetail/orderId/${orderId}`);
      console.log("orderDetails",response.data);
      setOrderDetails(response.data);
    } catch (err) {
      setError('Failed to fetch order details. Please try again later.');
      console.error('Error fetching order details:', err);
      navigate('/user/orders');
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/review/${localStorage.getItem('id')}`);
      console.log(response.data);
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reviews. Please try again later.');
      setLoading(false);
      console.error('Error fetching reviews:', err);
    }
  };
  
  
  const onSubmit = async (data) => {
  
    const userId = localStorage.getItem('id');
    console.log(userId);


    
    try {
      setLoading(true);
      
      if (editingReview) {
        // Update existing review
        await axios.put(`/reviews/${editingReview._id}`, {
          rating: data.rating,
          reviewText: data.reviewText
        });
        setSuccessMessage('Review updated successfully!');
      } else {
        // Add new review
        await axios.post('/review', {
          rating: data.rating,
          reviewText: data.reviewText,
          userId: userId,
          productId: selectedItem.productId._id,
          orderId: orderId
        });
        setSuccessMessage('Review added successfully!');
      }
      
      // Reset form and state
      reset();
      setIsAddingNew(false);
      setEditingReview(null);
      setError(null);
      
      // Fetch updated reviews
      await fetchReviews();
      
      // Navigate after state is updated
      setTimeout(() => {
        navigate('/user/reviews');
      }, 100);
      
    } catch (err) {
      setError('Failed to save review. Please try again.');
      console.error('Error saving review:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setValue('rating', review.rating);
    setValue('reviewText', review.reviewText);
    setEditingReview(review);
    setIsAddingNew(true);
    setError(null);
    setSuccessMessage('');
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`/reviews/${reviewId}`);
      await fetchReviews(); // Refresh the reviews list
      setSuccessMessage('Review deleted successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to delete review. Please try again.');
      console.error('Error deleting review:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
      ></i>
    ));
  };

  if (loading && !isAddingNew) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">
                {location.pathname.includes('/reviews/add') ? 'Write a Review' : 'My Reviews'}
              </h1>
              <p className="text-muted mb-0">
                {location.pathname.includes('/reviews/add')
                  ? 'Share your experience with this product'
                  : 'View and manage your product reviews'}
              </p>
            </div>
            {!location.pathname.includes('/reviews/add') && (
              <Link
                to={userId ? `/user/${userId}/orders` : "/login"}
                className="btn btn-primary"
              >
                <i className="bi bi-plus-lg me-2"></i>
                Write a Review
              </Link>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {successMessage && !error && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {(isAddingNew || location.pathname.includes('/reviews/add')) ? (
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {editingReview ? 'Edit Review' : 'Write a Review'}
              </h5>
              {orderDetails && (
                <div className="d-flex flex-column">
                  <div className="mb-3">
                    <label className="form-label">Select Product to Review <span className="text-danger">*</span></label>
                    <select 
                      className={`form-select ${!selectedItem ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        const selected = orderDetails.items.find(item => item.productId._id === e.target.value);
                        setSelectedItem(selected);
                      }}
                      value={selectedItem?.productId._id || ''}
                      required
                    >
                      <option value="">Select a product</option>
                      {orderDetails.items.map((item) => (
                        <option key={item.productId._id} value={item.productId._id}>
                          {item.productId.productName} 
                        </option>
                      ))}
                    </select>
                    {!selectedItem && (
                      <div className="invalid-feedback">Please select a product to review</div>
                    )}
                  </div>
                  {selectedItem && (
                    <div className="d-flex align-items-center">
                      <img
                        src={selectedItem.productId.productImageURL1}
                        alt={selectedItem.productId.productName}
                        className="rounded me-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="mb-0">{selectedItem.productId.productName}</h6>
                     
                      </div>
                    </div>
                  )}
 
                </div>
              )}
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="form-label">Rating</label>
                <div className="rating-input">
                  {[5, 4, 3, 2, 1].map(value => (
                    <div key={value} className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`rating${value}`}
                        value={value}
                        {...register('rating', { required: 'Please select a rating' })}
                      />
                      <label className="form-check-label" htmlFor={`rating${value}`}>
                        {renderStars(value)}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.rating && (
                  <div className="text-danger small mt-1">{errors.rating.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="reviewText" className="form-label">Your Review</label>
                <textarea
                  className={`form-control ${errors.reviewText ? 'is-invalid' : ''}`}
                  id="reviewText"
                  rows="4"
                  placeholder="Share your experience with this product..."
                  {...register('reviewText', {
                    required: 'Please write your review',
                    minLength: { value: 10, message: 'Review must be at least 10 characters long' }
                  })}
                ></textarea>
                {errors.reviewText && (
                  <div className="invalid-feedback">{errors.reviewText.message}</div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    reset();
                    setEditingReview(null);
                    setSelectedItem(null);
                    navigate('/user/reviews');
                     setIsAddingNew(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !selectedItem}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="row">
          {reviews.length === 0 ? (
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <i className="bi bi-star fs-1 text-muted mb-3"></i>
                  <h3 className="h4 mb-3">No reviews yet</h3>
                  <p className="text-muted mb-4">You haven't written any reviews yet.</p>
                  <Link to={userId ? `/user/${userId}/orders` : "/login"} className="btn btn-primary">
                    View Your Orders
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="col-12 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex mb-3">
                      <img
                        src={review.productId.productImageURL1}
                        alt={review.productId.productName}
                        className="rounded me-3"
                        style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="mb-1">{review.productId.productName}</h5>
                            <div className="mb-2">
                              {renderStars(review.rating)}
                            </div>
                            <p className="text-muted small mb-0">
                              Reviewed on {review.updatedAt.split('T')[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="mb-3">{review.reviewText}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage; 