import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AddressManagementPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
   const [states, setstates] = useState([])
    const [citys, setcitys] = useState([])
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchAddresses();
    getState();

  }, []);

  const fetchAddresses = async () => {
    try {
      const userId = localStorage.getItem("id");
      const response = await axios.get(`/address/user/${userId}`);
      console.log('Fetched Addresses:', response);
      if (response.data && response.data.data) {
        setAddresses(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to fetch addresses');
      setLoading(false);
    }
  };

  const getState=async()=>{
    const res=await axios.get("/state");
    console.log("state object",res.data)
    setstates(res.data.data)
  }

  const getCityByStateId=async(id)=>{
    console.log(id)
    const res=await axios.get("/city/getcitybystate/"+id)
    console.log("city data: ",res)
    setcitys(res.data.data)

  }

// console.log(userId); 

  const onSubmit = async (data) => {
    
    const userId = localStorage.getItem("id");
    data.userId=userId
  console.log(data)
      try {
      setLoading(true);
      if (editingAddress) {
        const response = await axios.put(`/address/${editingAddress._id}`, data);
        toast.success('Address updated successfully!');
      } else {
        const response = await axios.post('/address/', data);
        toast.success('Address added successfully!');
      }
      reset();
      setIsAddingNew(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    console.log(address)
    setEditingAddress(address);
    setIsAddingNew(true);
    setValue('fullName', address.fullName);
    setValue('addressLine1', address.addressLine1);
    setValue('addressLine2', address.addressLine2);
    setValue('city', address.city.name);
    setValue('state', address.state.name);
    setValue('pincode', address.pincode);
    setValue('phone', address.phone);
    setValue('addressType', address.addressType);
    setValue('isDefault', address.isDefault);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`/address/${addressId}`);
        toast.success('Address deleted successfully!');
        fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    console.log(addressId)
    try {
      await axios.put(`/address/${addressId}/default`);
      toast.success('Default address updated!');
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="address-management-page">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">My Addresses</h1>
              <p className="text-muted mb-0">Manage your delivery addresses</p>
            </div>
            {!isAddingNew && (
              <button
                className="btn btn-primary"
                onClick={() => setIsAddingNew(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add New Address
              </button>
            )}
             <div className="mt-3">
                    <Link to={userId ? `/user/${userId}/checkout` : "/login"} className="btn btn-outline-primary">
                      Add New Address
                    </Link>
                  </div>
          </div>
        </div>
      </div>

      {isAddingNew && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">{editingAddress ? 'Edit Address' : 'Add New Address'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters"
                      }
                    })}
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName.message}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number"
                      }
                    })}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone.message}</div>
                  )}
                </div>

                {/* Address Line 1 */}
                <div className="col-12">
                  <label className="form-label">Address Line 1</label>
                  <input
                    type="text"
                    className={`form-control ${errors.addressLine1 ? 'is-invalid' : ''}`}
                    {...register("addressLine1", {
                      required: "Address is required"
                    })}
                  />
                  {errors.addressLine1 && (
                    <div className="invalid-feedback">{errors.addressLine1.message}</div>
                  )}
                </div>

                {/* Address Line 2 */}
                <div className="col-12">
                  <label className="form-label">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("addressLine2")}
                  />
                </div>

              

                {/* State */}
                <div className="col-md-4">
                  <label className="form-label">State</label>
                
                   <select className={`form-control ${errors.state ? 'is-invalid' : ''}`} {...register("state", {
                      required: "State is required"
                    })} onChange={(event)=>{getCityByStateId(event.target.value)}}>
                      <option value="">Select State</option>
                      {
                        states?.map((state)=>{
                            return <option value={state._id} key={state._id}>
                                {
                                    state.name
                                }
                            </option>
                        })
                      }

                    </select>
                  {errors.state && (
                    <div className="invalid-feedback">{errors.state.message}</div>
                  )}
                </div>

                  {/* City */}
                  <div className="col-md-4">
                  <label className="form-label">City</label>
                 
                  <select className={`form-control ${errors.state ? 'is-invalid' : ''}`}  {...register("city", {required: "City is required"})} onChange={(event)=>{(event.target.value)}}>
              <option value="">Select </option>
              {
                 citys?.map((city)=>{
                  return <option key={city._id} value={city._id}>
                    {
                      city.name
                    }
                  </option>
                 })
              }
            </select>
                  {errors.city && (
                    <div className="invalid-feedback">{errors.city.message}</div>
                  )}
                </div>

                {/* Pincode */}
                <div className="col-md-4">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                    {...register("pincode", {
                      required: "Pincode is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Please enter a valid 6-digit pincode"
                      }
                    })}
                  />
                  {errors.pincode && (
                    <div className="invalid-feedback">{errors.pincode.message}</div>
                  )}
                </div>

                {/* Address Type */}
                <div className="col-md-6">
                  <label className="form-label">Address Type</label>
                  <select
                    className={`form-select ${errors.addressType ? 'is-invalid' : ''}`}
                    {...register("addressType", {
                      required: "Address type is required"
                    })}
                  >
                    <option value="">Select Type</option>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.addressType && (
                    <div className="invalid-feedback">{errors.addressType.message}</div>
                  )}
                </div>

                {/* Is Default */}
                <div className="col-md-6">
                  <div className="form-check mt-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isDefault"
                      {...register("isDefault")}
                    />
                    <label className="form-check-label" htmlFor="isDefault">
                      Set as default address
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="col-12">
                  <hr />
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingAddress(null);
                        reset();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        editingAddress ? 'Update Address' : 'Save Address'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="row">
        {addresses.map((address) => (
          <div key={address._id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="card-title mb-1">{address.fullName}</h5>
                    {address.isDefault && (
                      <span className="badge bg-primary">Default</span>
                    )}
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn btn-link dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      
                    >
                      
                    </button>

                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(address)}
                        >
                          <i className="bi bi-pencil me-2"></i>
                          Edit
                        </button>
                      </li>
                      {!address.isDefault && (
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleSetDefault(address._id)}
                          >
                            <i className="bi bi-check-circle me-2"></i>
                            Set as Default
                          </button>
                        </li>
                      )}
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(address._id)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="card-text mb-1">{address.phone}</p>
                <p className="card-text mb-1">{address.addressLine1}</p>
                {address.addressLine2 && (
                  <p className="card-text mb-1">{address.addressLine2}</p>
                )}
                <p className="card-text mb-1">
                  {`${address.city.name}, ${address.state.name} - ${address.pincode}`}
                </p>
                <p className="card-text text-muted">
                  <small className="text-capitalize">{address.addressType}</small>
                </p>
              </div>
            </div>
          </div>
        ))}

        {addresses.length === 0 && !isAddingNew && (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="bi bi-geo-alt display-4 text-muted mb-3"></i>
                <h3 className="h4 mb-3">No addresses found</h3>
                <p className="text-muted mb-4">Add your first delivery address to get started.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAddingNew(true)}
                >
                  Add New Address
                </button>
              </div>
            </div>
            
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AddressManagementPage; 