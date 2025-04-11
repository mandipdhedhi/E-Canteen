import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CityManagement = () => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchCities();
    fetchStates();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get('/city');
      setCities(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Failed to fetch cities');
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get('/state');
      setStates(response.data.data);
    } catch (error) {
      console.error('Error fetching states:', error);
      toast.error('Failed to fetch states');
    }
  };

  const handleOpenModal = (city = null) => {
    setSelectedCity(city);
    if (city) {
      reset({
        name: city.name,
        stateId: city.stateId._id
      });
    } else {
      reset({
        name: '',
        stateId: ''
      });
    }
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleOpenStateModal = (state = null) => {
    setSelectedState(state);
    if (state) {
      reset({
        name: state.name
      });
    } else {
      reset({
        name: ''
      });
    }
    setIsStateModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCity(null);
    reset();
  };

  const handleCloseStateModal = () => {
    setIsStateModalOpen(false);
    setSelectedState(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (selectedCity) {
        await axios.put(`/city/update/${selectedCity._id}`, data);
        toast.success('City updated successfully');
      } else {
        await axios.post('/city/addcity', data);
        toast.success('City added successfully');
      }
      handleCloseModal();
      fetchCities();
    } catch (error) {
      console.error('Error saving city:', error);
      toast.error(error.response?.data?.message || 'Failed to save city');
    }
  };

  const onSubmitState = async (data) => {
  console.log(data);    
 
    try {
      if (selectedState) {
        await axios.put(`/state/update/${selectedState._id}`, data);
        toast.success('State updated successfully');
      } else {
        await axios.post('/state/addstate', data);
        toast.success('State added successfully');
      }
      handleCloseStateModal();
      fetchStates();
    } catch (error) {
      console.error('Error saving state:', error);
      toast.error(error.response?.data?.message || 'Failed to save state');
    }
  };

  const handleDelete = async (cityId) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        await axios.delete(`/city/delete/${cityId}`);
        toast.success('City deleted successfully');
        fetchCities();
      } catch (error) {
        console.error('Error deleting city:', error);
        toast.error('Failed to delete city');
      }
    }
  };

  const handleDeleteState = async (stateId) => {
    if (window.confirm('Are you sure you want to delete this state?')) {
      try {
        await axios.delete(`/state/delete/${stateId}`);
        toast.success('State deleted successfully');
        fetchStates();
      } catch (error) {
        console.error('Error deleting state:', error);
        toast.error('Failed to delete state');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* State Management Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">State Management</h1>
              <p className="text-muted mb-0">Manage states</p>
            </div>
            <button
              className="btn btn-warning"
              onClick={() => handleOpenStateModal()}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Add New State
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>State Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {states?.map((state) => (
                  <tr key={state._id}>
                    <td>{state?.name}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleOpenStateModal(state)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteState(state._id)}
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

      {/* City Management Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">City Management</h1>
              <p className="text-muted mb-0">Manage cities and their states</p>
            </div>
            <button
              className="btn btn-warning"
              onClick={() => handleOpenModal()}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Add New City
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>City Name</th>
                  <th>State</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cities?.map((city) => (
                  <tr key={city._id}>
                    <td>{city?.name}</td>
                    <td>{city?.stateId?.name}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleOpenModal(city)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(city._id)}
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

      {/* City Modal */}
      {isModalOpen && (
        <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold my-4">
              {selectedCity ? "Edit City" : "Add New City"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City Name"
                  {...register('name', {
                    required: 'City name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  {...register('stateId', {
                    required: 'State is required'
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.stateId && (
                  <span className="text-red-500 text-sm">{errors.stateId.message}</span>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary h-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary h-10"
                >
                  {selectedCity ? "Update" : "Add"} City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* State Modal */}
      {isStateModalOpen && (
        <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold my-4">
              {selectedState ? "Edit State" : "Add New State"}
            </h2>
            <form onSubmit={handleSubmit(onSubmitState)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State Name
                </label>
                <input
                  type="text"
                  placeholder="State Name"
                  {...register('name', {
                    required: 'State name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message}</span>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseStateModal}
                  className="btn btn-secondary h-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary h-10"
                >
                  {selectedState ? "Update" : "Add"} State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityManagement;
