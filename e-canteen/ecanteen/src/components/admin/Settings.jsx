import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useForm } from "react-hook-form";
import { Bounce, ToastContainer } from "react-toastify";
import toast from "react-hot-toast";

const Settings = () => {
  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    formState: { errors: profileErrors }, 
    reset: resetProfile,
  } = useForm();

  const { 
    register: registerSettings, 
    handleSubmit: handleSubmitSettings, 
    formState: { errors: settingsErrors },
    reset: resetSettings 
  } = useForm();

  // Site settings state
  

  useEffect(() => {
    const adminId = localStorage.getItem('id');
    console.log(adminId);

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/admin/getadminbyid/${adminId}`);
        console.log(response);
        const adminData = response.data.data;
        console.log(adminData);

        // Reset form with fetched data
        resetProfile({
          name: adminData.name,
          email: adminData.email,
          phone: adminData.phone,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchProfile();

  }, [registerProfile]);
  const [siteDatas, setSiteDatas] = useState([]);
  useEffect(() => {
  const fetchSiteData = async () => {
      const response = await axios.get('/site/get/');
      console.log("site data",response.data.data[0]);
     const siteData = response.data.data[0];
     setSiteDatas(siteData);


      resetSettings({
        siteName: siteData.siteName,
        email: siteData.email,
        phone: siteData.phone,
        address1: siteData.address1,
        address2: siteData.address2,
        description: siteData.description,
        enableRegistration: siteData.enableRegistration,
        enableReviews: siteData.enableReviews,
      
      });
    } 
    fetchSiteData();
  }, [registerSettings]);

  // Handle profile form submission
  const onSubmitProfile = async (data) => {

    console.log( {
      email: data.email,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword
    })
    try {
      const adminId = localStorage.getItem('id');
      
      if(data.currentPassword === data.newPassword){
        alert('New password cannot be the same as the current password');
        return;
      }
      if(data.newPassword !== data.confirmPassword){
        alert('New password and confirm password do not match');
        return;
      }

      const response = await axios.post(`/admin/changepassword/`, {
        email: data.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      alert(response.data.message);
      
     
    } catch (error) {
      console.error("Error updating profile:", error);
      console.log(error.response.status);
      if (error.response) {
        if (error.response.status === 404) {
        alert('User not found');
        } else if (error.response.status === 400) {
         
          alert('Current password is incorrect');
        } else {
          alert('Network error. Please check your connection!');
        }
      } else {
        toast.error('Network error. Please check your connection!');
      }
    }
  };

  // Handle settings form submission
  const onSubmitSettings = async (data) => {
    console.log(data);
    try {
      const siteId = siteDatas._id;
      console.log(siteId);
      const res = await axios.post(`/site/update/${siteId}`, data);
      console.log("site updated:", res);
      alert("site updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Error updating settings");
    }
  };

  return (
    <div className="container py-4 bg-light">

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
      <h2 className="display-6 mb-4 border-bottom pb-3">Settings</h2>
      
      <div className="row justify-content-center">
        {/* Admin Profile Section */}
        <div className="col-12 col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary bg-gradient text-white py-3">
              <h3 className="card-title mb-0 d-flex align-items-center">
                <i className="bi bi-person-circle me-2"></i>
                Admin Profile
              </h3>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} noValidate>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${profileErrors.name ? 'is-invalid' : ''}`}
                      {...registerProfile("name", { required: "Name is required" })}
                    />
                    {profileErrors.name && <div className="invalid-feedback">{profileErrors.name.message}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${profileErrors.email ? 'is-invalid' : ''}`}
                      {...registerProfile("email", { required: "Email is required" })}
                    />
                    {profileErrors.email && <div className="invalid-feedback">{profileErrors.email.message}</div>}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className={`form-control ${profileErrors.phone ? 'is-invalid' : ''}`}
                    {...registerProfile("phone", { required: "Phone is required" })}
                  />
                  {profileErrors.phone && <div className="invalid-feedback">{profileErrors.phone.message}</div>}
                </div>
                
                <hr className="my-4" />
                
                <h4 className="card-subtitle mb-3">Change Password</h4>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className={`form-control ${profileErrors.currentPassword ? 'is-invalid' : ''}`}
                      {...registerProfile("currentPassword", { required: "Current password is required" })}
                    />
                    {profileErrors.currentPassword && <div className="invalid-feedback">{profileErrors.currentPassword.message}</div>}
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className={`form-control ${profileErrors.newPassword ? 'is-invalid' : ''}`}
                      {...registerProfile("newPassword", { required: "New password is required" })}
                    />
                    {profileErrors.newPassword && <div className="invalid-feedback">{profileErrors.newPassword.message}</div>}
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className={`form-control ${profileErrors.confirmPassword ? 'is-invalid' : ''}`}
                      {...registerProfile("confirmPassword", { required: "Please confirm your password" })}
                    />
                    {profileErrors.confirmPassword && <div className="invalid-feedback">{profileErrors.confirmPassword.message}</div>}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Site Settings Section */}
        <div className="col-12 col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success bg-gradient text-white py-3">
              <h3 className="card-title mb-0 d-flex align-items-center">
                <i className="bi bi-gear-fill me-2"></i>
                Site Settings
              </h3>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmitSettings(onSubmitSettings)} noValidate>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Site Name</label>
                    <input
                      type="text"
                      className={`form-control ${settingsErrors.siteName ? 'is-invalid' : ''}`}
                      {...registerSettings("siteName", { required: "Site name is required" })}
                    />
                    {settingsErrors.siteName && <div className="invalid-feedback">{settingsErrors.siteName.message}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className={`form-control ${settingsErrors.contactEmail ? 'is-invalid' : ''}`}
                      {...registerSettings("email", { required: "Contact email is required" })}
                    />
                    {settingsErrors.email && <div className="invalid-feedback">{settingsErrors.email.message}</div>}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">description</label>
                  <textarea
                    className={`form-control ${settingsErrors.description ? 'is-invalid' : ''}`}
                    rows="3"
                    {...registerSettings("description", { required: "Site description is required" })}
                  ></textarea>
                  {settingsErrors.description  && <div className="invalid-feedback">{settingsErrors.description.message}</div>}
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="tel"
                      className={`form-control ${settingsErrors.phone ? 'is-invalid' : ''}`}
                      {...registerSettings("phone", { required: "Contact phone is required" })}
                    />
                    {settingsErrors.phone && <div className="invalid-feedback">{settingsErrors.phone.message}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Address1</label>
                    <textarea
                      className={`form-control ${settingsErrors.address1 ? 'is-invalid' : ''}`}
                      rows="1"
                      {...registerSettings("address1", { required: "Address is required" })}
                    ></textarea>
                    {settingsErrors.address1 && <div className="invalid-feedback">{settingsErrors.address1.message}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Address2</label>
                    <textarea
                      className={`form-control ${settingsErrors.address2 ? 'is-invalid' : ''}`}
                      rows="1"
                      {...registerSettings("address2", { required: "Address is required" })}
                    ></textarea>
                    {settingsErrors.address2 && <div className="invalid-feedback">{settingsErrors.address2.message}</div>}
                  </div>
                </div>
                
                {/* <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Logo</label>
                    <input
                      type="file"
                      className={`form-control ${settingsErrors.logo ? 'is-invalid' : ''}`}
                      accept="image/*"
                      {...registerSettings("logo", { required: "Logo is required" })}
                    />
                    {settingsErrors.logo && <div className="invalid-feedback">{settingsErrors.logo.message}</div>}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Favicon</label>
                    <input
                      type="file"
                      className={`form-control ${settingsErrors.favicon ? 'is-invalid' : ''}`}
                      accept="image/*"
                      {...registerSettings("favicon", { required: "Favicon is required" })}
                    />
                    {settingsErrors.favicon && <div className="invalid-feedback">{settingsErrors.favicon.message}</div>}
                  </div>
                </div> */}
                
                <hr className="my-4" />
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="enableRegistration"
                        {...registerSettings("enableRegistration")}
                      />
                      <label className="form-check-label" htmlFor="enableRegistration">
                        Enable User Registration
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="enableReviews"
                        {...registerSettings("enableReviews")}
                      />
                      <label className="form-check-label" htmlFor="enableReviews">
                        Enable Product Reviews
                      </label>
                    </div>
                  </div>
                  
                  {/* <div className="col-md-4 mb-3">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="maintenanceMode"
                        {...registerSettings("maintenanceMode")}
                      />
                      <label className="form-check-label" htmlFor="maintenanceMode">
                        Maintenance Mode
                      </label>
                    </div>
                  </div> */}
                </div>
                
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  onClick={handleSubmitSettings(onSubmitSettings)}
                >
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;