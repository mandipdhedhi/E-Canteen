import React, { useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("category"); // "category" or "subcategory"
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const modalRef = useRef(null);

  const formValidation = {
    nameValidation: {
      required: {
        value: true,
        message: "Category name is required"
      },
      minLength: {
        value: 3,
        message: "Name must be at least 3 characters"
      }
    },
    descriptionValidation: {
      required: {
        value: true,
        message: "Description is required"
      }
    }
  };
   
  
  useEffect(() => {
    
    const fetchCategoriesAndSubcategories = async () => {
      try {
        //  all categories
        const categoryResponse = await axios.get("/category/");
        console.log("Fetched Categories:", categoryResponse.data);
        
        if (categoryResponse.data && categoryResponse.data.data) {
          // Then fetch all subcategories
          const subcategoryResponse = await axios.get("/subcategory/");
          console.log("Fetched Subcategories:", subcategoryResponse.data);
          
          // Transform categories with  subcategories
          const categoriesWithSubcategories = categoryResponse.data.data.map(category => {
            
            const categorySubcategories = subcategoryResponse.data?.filter(
              sub => sub.categoryId?._id=== category?._id
            ) || [];
            
            console.log(`Subcategories for category ${category.name}:`, categorySubcategories);
            
            return {
              id: category._id,
              name: category.name,
              description: category.description,
              subcategories: categorySubcategories.map(sub => ({
                id: sub._id,
                name: sub.name,
                description: sub.description,
                categoryId: sub.categoryId
                
              }))
            };
          });
          
          console.log("Final categories with subcategories:", categoriesWithSubcategories);
          setCategories(categoriesWithSubcategories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Failed to fetch data. Please try again later.');
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal for adding a new category
  const handleAddCategory = () => {
    setSelectedCategory(null);
    reset();
    setModalMode("category");
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Open modal for editing an existing category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    reset({
      name: category.name,
      description: category.description
    });
    setModalMode("category");
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Open modal for adding a new subcategory
  const handleAddSubcategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: "",
      description: "",
      parentId: category.id,
    });
    setModalMode("subcategory");
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Open modal for editing an existing subcategory
  const handleEditSubcategory = (category, subcategory) => {
    setSelectedCategory(category);
    setFormData({
      name: subcategory.name,
      description: subcategory.description,
      parentId: category.id,
      subcategoryId: subcategory.id,
    });
    setModalMode("subcategory");
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Open delete confirmation modal for category
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setModalMode("category");
    setIsDeleteModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Open delete confirmation modal for subcategory
  const handleDeleteSubcategoryClick = (category, subcategory) => {
    setSelectedCategory({ ...category, subcategoryToDelete: subcategory });
    setModalMode("subcategory");
    setIsDeleteModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    console.log(name)
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
    if (modalMode === "category") {
      if (selectedCategory) {
        // Update existing category
          const res = await axios.post("/category/update", {
            id: selectedCategory.id,
            ...data
          });

          if (res.data) {
        const updatedCategories = categories.map((c) =>
          c.id === selectedCategory.id
                ? { ...c, name: data.name, description: data.description }
            : c
        );
        setCategories(updatedCategories);
            toast.success('Category updated successfully!');
          }
      } else {
        // Add new category
          const res = await axios.post("/category/", data);
          console.log("Category Response:", res.data);

          if (res.data) {
        const newCategory = {
              id: res.data.data._id,
              name: data.name,
              description: data.description,
          subcategories: [],
        };
            setCategories(prevCategories => [...prevCategories, newCategory]);
            toast.success('Category added successfully!');
          }
      }
    } else if (modalMode === "subcategory") {
      // Find the parent category
      const parentCategory = categories.find((c) => c.id === formData.parentId);
      
      if (formData.subcategoryId) {
        // Update existing subcategory
          const res = await axios.post("/subcategory/update", {
            id: formData.subcategoryId,
            categoryId: parentCategory.id,
            ...data
          });

          if (res.data) {
        const updatedSubcategories = parentCategory.subcategories.map((s) =>
          s.id === formData.subcategoryId
                ? { ...s, name: data.name, description: data.description }
            : s
        );
        
        const updatedCategories = categories.map((c) =>
          c.id === parentCategory.id
            ? { ...c, subcategories: updatedSubcategories }
            : c
        );
        
        setCategories(updatedCategories);
            toast.success('Subcategory updated successfully!');
          }
      } else {
        // Add new subcategory
          const subcategoryData = {
            name: data.name,
            description: data.description,
            categoryId: parentCategory.id
          };
          
          const res = await axios.post("/subcategory/", subcategoryData);
          console.log("Subcategory Response:", res.data);

          if (res.data) {
        const newSubcategory = {
              id: res.data._id,
              name: data.name,
              description: data.description,
              categoryId: parentCategory.id
        };
        
        const updatedCategories = categories.map((c) =>
          c.id === parentCategory.id
            ? { ...c, subcategories: [...c.subcategories, newSubcategory] }
            : c
        );
        
        setCategories(updatedCategories);
            toast.success('Subcategory added successfully!');
          }
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        if (error.response.status === 404) {
          toast.error('Category not found');
        } else if (error.response.status === 400) {
          toast.error('Invalid data provided');
        } else {
          toast.error('An error occurred. Please try again later.');
        }
      } else {
        toast.error('Network error. Please check your connection!');
      }
    }
  };

  // Handle category deletion
  const handleDelete = async () => {
    try {
      if (modalMode === "category") {
        // Delete category
        const res = await axios.delete(`/category/${selectedCategory.id}`);
        
        if (res.data) {
          const updatedCategories = categories.filter((c) => c.id !== selectedCategory.id);
          setCategories(updatedCategories);
          toast.success('Category deleted successfully!');
        }
      } else if (modalMode === "subcategory" && selectedCategory.subcategoryToDelete) {
        // Delete subcategory
        const res = await axios.delete(`/subcategory/${selectedCategory.subcategoryToDelete.id}`);
        
        if (res.data) {
          const parentCategory = categories.find((c) => c.id === selectedCategory.id);
          const updatedSubcategories = parentCategory.subcategories.filter(
            (s) => s.id !== selectedCategory.subcategoryToDelete.id
          );
          
          const updatedCategories = categories.map((c) =>
            c.id === parentCategory.id
              ? { ...c, subcategories: updatedSubcategories }
              : c
          );
          
          setCategories(updatedCategories);
          toast.success('Subcategory deleted successfully!');
        }
      }

      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting:", error);
      if (error.response) {
        if (error.response.status === 404) {
          toast.error('Item not found');
        } else {
          toast.error('Failed to delete. Please try again later.');
        }
      } else {
        toast.error('Network error. Please check your connection!');
      }
    }
  };

  // Render a single category card
  const renderCategoryCard = (category) => (
    <div key={category.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gray-100 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{category.description}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditCategory(category)}
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
              title="Edit Category"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(category)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              title="Delete Category"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Subcategories</h4>
          <button
            onClick={() => handleAddSubcategory(category)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
            title="Add Subcategory"
          >
            Add Subcategory
          </button>
        </div>
        
        {category.subcategories.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No subcategories yet</p>
        ) : (
          <div className="space-y-3">
            {category.subcategories.map((subcategory) => renderSubcategoryCard(category, subcategory))}
          </div>
        )}
      </div>
    </div>
  );

  // Render a single subcategory card
  const renderSubcategoryCard = (category, subcategory) => (
    <div
      key={subcategory.id}
      className="bg-gray-50 p-3 rounded border flex justify-between items-center hover:bg-gray-100 transition-colors"
    >
      <div>
        <h5 className="font-medium">{subcategory.name}</h5>
        <p className="text-gray-600 text-sm">{subcategory.description}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handleEditSubcategory(category, subcategory)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit Subcategory"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteSubcategoryClick(category, subcategory)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete Subcategory"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4">
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
      
      <div className="row">
        <div className="col-md-6">
          <h1 className="text-2xl font-bold">Category Management</h1>
        </div>
        <div className="col-md-6 text-end">
          <button
            onClick={handleAddCategory}
            className="btn btn-warning h-10"
          >
           + Add New Category
          </button>
        </div>
      </div>

      <div className="mb-4">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="m-2 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-100 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="btn btn-secondary h-10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="btn btn-danger h-10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <hr/>
            {/* Subcategories Section */}
            <div className="p-4 border-t">
              <div className="row flex justify-between items-center mb-3">
                <div className="col-md-6">
                <h4 className="font-medium">Sub Categories</h4>
              </div>
              <div className="col-md-6 text-end">
                <button
                    onClick={() => handleAddSubcategory(category)}
                    className="btn btn-warning h-10"
                >
                 + Add Subcategory
                </button>
              </div>
            </div>
      
              {category.subcategories && category.subcategories.length > 0 ? (
                <div className="space-y-2 row">
                  {category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="col-md-3 m-2 bg-gray-50 p-3 rounded border flex justify-between items-center hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h5 className="font-medium">{subcategory.name}</h5>
                        <p className="text-gray-600 text-sm">{subcategory.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          title="Edit"
                          onClick={() => handleEditSubcategory(category, subcategory)}
                          className="btn btn-secondary h-10"
                        >
                          Edit
                        </button>
            <button
                          onClick={() => handleDeleteSubcategoryClick(category, subcategory)}
                          className="btn btn-danger h-10"
            >
                          Delete
            </button>
                      </div>
                    </div>
                  ))}
          </div>
        ) : (
                <p className="text-gray-500 text-sm italic">No subcategories yet</p>
        )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === "category" 
                ? (selectedCategory ? "Edit Category" : "Add New Category")
                : (selectedCategory?.subcategoryToDelete ? "Edit Subcategory" : "Add New Subcategory")}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <input
                    type="text"
                  placeholder={modalMode === "category" ? "Category Name" : "Subcategory Name"}
                  {...register("name", formValidation.nameValidation)}
                  className="w-full p-2 border rounded"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message}</span>
                )}
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Description"
                  {...register("description", formValidation.descriptionValidation)}
                  className="w-full p-2 border rounded"
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">{errors.description.message}</span>
                )}
                </div>
              {modalMode === "subcategory" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Category
                  </label>
                  <select
                    {...register("parentId")}
                    className="w-full p-2 border rounded"
                    defaultValue={selectedCategory?.id}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary h-10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                  className="btn btn-primary h-10"
                >
                  {modalMode === "category" 
                    ? (selectedCategory ? "Update" : "Add")
                    : (selectedCategory?.subcategoryToDelete ? "Update" : "Add")}
                  </button>
                </div>
              </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-4">
                {modalMode === "category"
                  ? `Are you sure you want to delete the category "${selectedCategory.name}" and all its subcategories? This action cannot be undone.`
                  : `Are you sure you want to delete the subcategory "${selectedCategory.subcategoryToDelete.name}"? This action cannot be undone.`}
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-secondary h-10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                className="btn btn-danger h-10"
                >
                  Delete
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;