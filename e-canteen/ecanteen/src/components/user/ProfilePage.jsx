import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState();

useEffect(() => {
  const id = localStorage.getItem("id");
  setUserId(id);
}, []);

  
  // User profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    dateJoined: '',
    totalOrders: 0
  });

  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("id");
      const response = await axios.get(`/user/${userId}`);
      console.log(response)
      const userData = response.data.data;
      console.log(userData.name)
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        avatar: userData.avatar || 'https://via.placeholder.com/150',
        dateJoined: userData.createdAt || new Date().toISOString(),
        totalOrders: userData.totalOrders || 0
      });

      reset({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Failed to fetch profile information');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchOrders = async () => {
    const userId=localStorage.getItem("id")
    const response = await axios.get(`/order/${userId}`);
    console.log("get orders",response)
    setOrders(response.data)
  }

  const onSubmit = async (data) => {
    console.log(data)
    try {
      setLoading(true);
      const res = await axios.post('/user/changepassword', data)
      console.log(res)
      alert('Password changed successfully')
      // Validate passwords if changing
      if (data.newPassword) {
        if (data.newPassword !== data.confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
        if (data.newPassword.length < 8) {
          toast.error('Password must be at least 8 characters long');
          return;
        }
      }
        
      
      // Prepare update data
      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone
      };
      
      // Add password fields only if they're being changed
      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }
            
      const response = await axios.put('/api/user/profile', updateData);
      
      setProfile(prev => ({
        ...prev,
        ...updateData
      }));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      if(err.response.status === 400){
        alert("Current password is incorrect...")
      }
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      ...profile,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditing(false);
  };

  if (loading && !isEditing) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="mb-3">My Profile</h1>
          <p className="text-muted">View and edit your profile information</p>
        </div>
      </div>

      <div className="row">
        {/* Profile Summary Card */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="rounded-circle mb-3"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <h5 className="card-title mb-1">{profile.name}</h5>
              <p className="text-muted small mb-3">{profile.email}</p>
              <div className="d-flex justify-content-center gap-2 mb-3">
                <Link  to={userId ? `/user/${userId}/orders` : "/login"} className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-box me-2"></i>
                  Orders ({orders.length})
                </Link>
                <Link  to={userId ? `/user/${userId}/addresses` : "/login"} className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-geo-alt me-2"></i>
                  Addresses
                </Link>
              </div>
              <div className="text-muted small">
                Member since {new Date(profile.dateJoined).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profile Information</h5>
                {!isEditing && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                  {/* Personal Information */}
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      {...register("name", {
                        required: "name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters"
                        }
                      })}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name.message}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Phone number must be 10 digits"
                        }
                      })}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone.message}</div>
                    )}
                  </div>

                  {/* Password Change Section */}
                  <div className="col-12">
                    <h6 className="mb-3">Change Password</h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                          {...register("currentPassword", {
                            required: "Current password is required",
                            minLength: {
                              value: 3,
                              message: "Password must be at least 8 characters"
                            }
                          })}
                        />
                        {errors.currentPassword && (
                          <div className="invalid-feedback">{errors.currentPassword.message}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                          {...register("newPassword", {
                            required: "New password is required",
                            minLength: {
                              value: 3,
                              message: "Password must be at least 8 characters"
                            }
                          })}
                        />
                        {errors.newPassword && (
                          <div className="invalid-feedback">{errors.newPassword.message}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          {...register("confirmPassword", {
                            required: "Confirm password is required",
                            validate: value => value === getValues("newPassword") || "Passwords do not match"
                          })}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="col-12">
                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 