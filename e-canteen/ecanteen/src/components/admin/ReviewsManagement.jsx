import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const modalRef = useRef(null);


  
  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get('/review/all');
      console.log(response.data);
      setReviews(response.data);
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.productId?.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewText?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = filterRating ? review.rating === parseInt(filterRating) : true;
    return matchesSearch && matchesRating;
  });
  const handleViewReview = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
    
    // Scroll to top of the page to show modal
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); 
  };
  

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setIsModalOpen(false)

    setIsDeleteModalOpen(true);

    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); 

  };

  const handleDelete = async (reviewId) => {
    try {
      setLoading(true);
      await axios.delete(`/review/${reviewId}`);
      setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
      setIsDeleteModalOpen(false)
      alert("Review deleted successfully!")
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

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

  const getRatingStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="p-md-4 p-2">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 p-2 ">Reviews & Ratings Management</h2>

      {/* Filters */}
      <div className="flex flex-col  gap-4  p-2">
        <div className="w-full sm:w-1/2 mb-3">
          <input
            type="text"
            placeholder="Search by product, user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded text-sm sm:text-base"
          />
        </div>

        <div className="w-full sm:w-1/2">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full p-2 border rounded text-sm sm:text-base"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List - Mobile View */}
      <div className="d-block d-md-none mt-3 p-2">
        {filteredReviews.map(review => (
          <div key={review._id} className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-sm">{review.productId?.productName}</h3>
                <p className="text-gray-600 text-xs">{review.userId?.name}</p>
              </div>
              <span className={`text-yellow-500 text-sm ${review.rating < 3 ? "text-red-500" : ""}`}>
                {getRatingStars(review.rating)}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{review.reviewText}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{formatDate(review.updatedAt)}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewReview(review)}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteClick(review)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Table - Desktop View */}
      <div className=" d-none d-md-block overflow-x-auto p-2 row">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Rating</th>
              <th className="py-3 px-4 text-left">Review Text</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map(review => (
              <tr key={review._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{review.productId?.productName}</td>
                <td className="py-3 px-4">{review.userId?.name}</td>
                <td className="py-3 px-4">
                  <span className={`text-yellow-500 ${review.rating < 3 ? "text-red-500" : ""}`}>
                    {getRatingStars(review.rating)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="truncate max-w-xs ">{review.reviewText}</div>
                </td>
                <td className="py-3 px-4">{formatDate(review.updatedAt)}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewReview(review)}
                      className="btn btn-primary h-10"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteClick(review)}
                      className="btn btn-danger h-10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredReviews.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Details Modal */}
      {isModalOpen && selectedReview && (
        <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Review Details</h3>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <p className="font-medium text-sm sm:text-base">Product: {selectedReview.productId.productName}</p>
                  </div>

                  <div>
                    <p className="font-medium text-sm sm:text-base">User: {selectedReview.userId.name} ({selectedReview.userId.email})</p>
                  </div>

                  <div>
                    <p className={`font-medium text-sm sm:text-base text-yellow-500 ${selectedReview.rating < 3 ? "text-red-500" : ""}`}>
                      Rating: {getRatingStars(selectedReview.rating)} ({selectedReview.rating}/5)
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm sm:text-base">Date: {selectedReview.updatedAt.split('T')[0]}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-medium text-sm sm:text-base">Review Text: {selectedReview.reviewText}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => handleDeleteClick(selectedReview)}
                  className="btn btn-danger h-8 sm:h-10 text-sm sm:text-base"
                >
                  Delete Review
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary h-8 sm:h-10 text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-4 text-sm sm:text-base">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn btn-secondary h-8 sm:h-10 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedReview._id)}
                  className="btn btn-danger h-8 sm:h-10 text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;