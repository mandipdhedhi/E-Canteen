import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddAdmin = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log(data)
      if(data.roleId==="67c5c4e0e375b3c915fa401b"){
        data.canteen="Jodhpur"

        const response = await axios.post("/signup", data)
        console.log(response)
        
        if (response.data) {
          toast.success("Admin registered successfully!");
          reset(); // Reset form after successful submission
        }
      }else{
      const response = await axios.post("/admin/addadmin", data);
      console.log("Admin Registration Response:", response);

      if (response.data.message == "email number already in use") {
        toast.success("Admin registered successfully!");
        reset();
      } else if (response.data) {
        toast.success("Admin registered successfully!");
        reset(); // Reset form after successful submission
      }
      
      }
      
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.response?.data?.message || "Failed to register admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container justify-content-center mt-5">
      <div className="row justify-content-center m-2 ">
        <div className="card shadow col-12 col-lg-8 mb-4 mt-5">
          <div className="card-body">
            <h2 className="text-center mb-4">New Admin Registration</h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters"
                  }
                })}
                placeholder="Enter full name"
              />
              {errors.name && (
                <div className="text-danger">{errors.name.message}</div>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="Enter email address"
              />
              {errors.email && (
                <div className="text-danger">{errors.email.message}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                {...register("password", {
                  required: "Password is required"
                })}
                placeholder="Enter password"
              />
              {errors.password && (
                <div className="text-danger">{errors.password.message}</div>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number"
                  }
                })}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <div className="text-danger">{errors.phone.message}</div>
              )}
            </div>

            {/* Role Field */}
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                {...register("roleId", {
                  required: "Role is required"
                })}
              >
                <option value="67c5c4d5e375b3c915fa4019">Admin</option>
                <option value="67c5c4e0e375b3c915fa401b">User</option>
              </select>
              {errors.role && (
                <div className="text-danger">{errors.role.message}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                  </>
                ) : (
                  "Register Admin"
                )}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin; 