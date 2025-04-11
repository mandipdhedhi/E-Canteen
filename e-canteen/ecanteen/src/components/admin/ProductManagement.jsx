import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [formData, setFormData] = useState({
    parentId: "",
  });
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch products, categories, and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products
        const productResponse = await axios.get("/product/");
        console.log("Fetched Products:", productResponse.data);
        
        if (productResponse.data && productResponse.data) {
        
          const transformedProducts = productResponse.data.map(product => ({
            _id: product._id,
            productName: product.productName,
            categoryId: product.categoryId,
            subCategoryId: product.subCategoryId,
            basePrice: product.basePrice,
            offerPrice: product.offerPrice,
            offerPercentage: product.offerPercentage,
            productDetail: product.productDetail,
            productImageURL1: product.productImageURL1,
            productImageURL2: product.productImageURL2,
            productImageURL3: product.productImageURL3,
            inStock: product.inStock,
            categoryName: product.categoryId?.name || 'N/A',
            subCategoryName: product.subCategoryId?.name || 'N/A'
          }));
          
          console.log("Transformed Products:", transformedProducts);
          setProducts(transformedProducts);
  
        }

        // Fetch categories for the dropdown
        const categoryResponse = await axios.get("/category/");
        console.log("Fetched Categories:", categoryResponse.data);
        
        if (categoryResponse.data && categoryResponse.data.data) {
          setCategories(categoryResponse.data.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Failed to fetch data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.parentId) {
        try {
          const response = await axios.get(`/subcategory/get/${formData.parentId}`);
          console.log("Fetched Subcategories:", response.data);
          
          if (response.data && response.data.data) {
            setSubcategories(response.data.data);
          } else {
            setSubcategories([]);
          }
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setSubcategories([]);
        }
      } else {
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [formData.parentId]);

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData({ parentId: categoryId });
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        subCategoryId: ''
      });
    }
  };

  // Open modal for adding a new product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    reset();
    setModalMode("add");
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Open modal for editing an existing product
  const handleEditProduct = (product) => {

    setSelectedProduct(product);
    reset({
      productName: product.productName,
      categoryId: product.categoryId._id,
      subCategoryId: product.subCategoryId._id,
      basePrice: product.basePrice,
      offerPrice: product.offerPrice,
      offerPercentage: product.offerPercentage,
      productDetail: product.productDetail,
      productImageURL1: product.productImageURL1,
      productImageURL2: product.productImageURL2,
      productImageURL3: product.productImageURL3,
      inStock: product.inStock,
    });
    setFormData({ parentId: product.categoryId._id });
    setModalMode("edit");
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handle form submission
  const onSubmit = async (data) => {

    console.log(data)
  
    try {
      if (modalMode === "edit" && selectedProduct) {
        // Update product
        const res = await axios.put(`/product/${selectedProduct._id}`, {
          ...data,
          categoryId: formData.parentId,
          subCategoryId: data.subCategoryId,
        });

        if (res.data) {
          const updatedProducts = products.map((p) =>
            p._id === selectedProduct._id
              ? { ...p, ...data, categoryId: formData.parentId, subCategoryId: data.subCategoryId }
              : p
      );
      setProducts(updatedProducts);
          toast.success('Product updated successfully!');
        }
    } else {
      // Add new product
        const res = await axios.post("/product/", {
          ...data,
          categoryId: formData.parentId,
          subCategoryId: data.subCategoryId,
        });
        console.log("Product Response:", res.data);

        if (res.data) {
      const newProduct = {
            _id: res.data._id,
            ...data,
            categoryId: formData.parentId,
            subCategoryId: data.subCategoryId,
          };
          setProducts(prevProducts => [...prevProducts, newProduct]);
          toast.success('Product added successfully!');
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error('Failed to save product');
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/product/${selectedProduct._id}`);
      
      if (res.data) {
        const updatedProducts = products.filter((p) => p._id !== selectedProduct._id);
      setProducts(updatedProducts);
        toast.success('Product deleted successfully!');
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* Product Management Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="row mb-4">
         <div className="col-md-6"> 
          <h2 className="text-2xl font-bold">Product Management</h2>
          </div>
         <div className="col-md-6 text-end">
         <button
            onClick={handleAddProduct}
            className="btn btn-warning h-10"
        >
         + Add New Product
        </button>
         </div>
      </div>
      
        {/* Products Grid */}
        <div className="row">
          {products.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info">
                No products found. Add some products to get started.
              </div>
            </div>
          ) : (
            products.map(product => (
              <div key={product._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm product-card">
                  <div className="position-relative">
                 <img
                    src={product.productImageURL1}
                    className="card-img-top"
                    alt={product.productName || "Product image"}
                    style={{ height: "180px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = product.productImageURL2 || product.productImageURL3 || "/fallback-image.jpg";
                    }}
                  />


                    {product.offerPercentage > 0 && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-danger">
                          {product.offerPercentage}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="badge bg-secondary">{product.categoryName}</span>
                      <span className="badge bg-info">{product.subCategoryName}</span>
                    </div>

                    <h5 className="card-title mb-2">{product.productName}</h5>
                    <p className="card-text text-muted small mb-2">
                      {product.productDetail?.length > 100
                        ? `${product.productDetail.substring(0, 100)}...`
                        : product.productDetail}
                    </p>
                    <div className="mt-auto">
                      <div className="mb-2">
                        <div className="text-end">
                          <span className="badge bg-secondary">
                            {product.inStock ? "stock" : "out of stock"}
                          </span>
                        </div>
                      </div>

                      {/* Single row for price and buttons */}
                      <div className="d-flex justify-content-between align-items-center">
                        {/* Price Section */}
                        <div>
                          {product.offerPrice ? (
                            <div>
                              <span className="h5 mb-0 text-success">₹{product.offerPrice}</span>
                              <span className="text-muted text-decoration-line-through ms-2">
                                ₹{product.basePrice}
                              </span>
                            </div>
                          ) : (
                            <span className="h5 mb-0">₹{product.basePrice}</span>
                          )}
                        </div>
                        

                        {/* Buttons Section */}
                        <div className="d-flex gap-2">
                          <button onClick={() => handleEditProduct(product)} className="btn btn-warning btn-sm">
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button onClick={() => handleDeleteClick(product)} className="btn btn-danger btn-sm">
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    </div>
                  </div>
                </div>
             
            ))
          )}
        </div>
      </div>
      
      {/* Add/Edit Product Modal */}
      {isModalOpen && (
    
    <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ">
  <div className="bg-white rounded-lg shadow p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <h2 className="text-center text-2xl font-bold mb-4">
      {modalMode === "add" ? "Add New Product" : "Edit Product"}
    </h2>
    
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {/* Product Name */}
      <div className="mb-3">
        <label className="form-label">Product Name</label>
        <input
          type="text"
          className="form-control"
          {...register("productName", { required: "Product name is required" })}
        />
        {errors.productName && <p className="text-danger">{errors.productName.message}</p>}
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="form-label">Category</label>
        <select className="form-select" value={formData.parentId} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div className="mb-3">
        <label className="form-label">Subcategory</label>
        <select className="form-select" {...register("subCategoryId", { required: "Subcategory is required" })}>
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
          ))}
        </select>
        {errors.subCategoryId && <p className="text-danger">{errors.subCategoryId.message}</p>}
      </div>

      {/* Pricing Fields */}
      <div className="mb-3">
        <label className="form-label">Base Price</label>
        <input type="number" className="form-control" {...register("basePrice", { required: "Base price is required" })} />
        {errors.basePrice && <p className="text-danger">{errors.basePrice.message}</p>}
      </div>

      <div className="mb-3">
        <label className="form-label">Offer Price</label>
        <input type="number" className="form-control" {...register("offerPrice")} />
      </div>

      <div className="mb-3">
        <label className="form-label">Offer Percentage</label>
        <input type="number" className="form-control" {...register("offerPercentage")} />
      </div>

      {/* Product Detail */}
      <div className="mb-3">
        <label className="form-label">Product Detail</label>
        <textarea className="form-control" rows="3" {...register("productDetail", { required: "Product detail is required" })}></textarea>
        {errors.productDetail && <p className="text-danger">{errors.productDetail.message}</p>}
      </div>

      {/* Image URLs */}
      <div className="mb-3">
        <label className="form-label">Product Image URL 1</label>
        <input type="text" className="form-control" {...register("productImageURL1", { required: "Product image is required" })} />
        {errors.productImageURL1 && <p className="text-danger">{errors.productImageURL1.message}</p>}
      </div>

      <div className="mb-3">
        <label className="form-label">Product Image URL 2</label>
        <input type="text" className="form-control" {...register("productImageURL2")} />
      </div>

      <div className="mb-3">
        <label className="form-label">Product Image URL 3</label>
        <input type="text" className="form-control" {...register("productImageURL3")} />
      </div>

      {/* Stock */}
      <div className="mb-3">
        <label className="form-label">In Stock</label>
        <select className="form-select" {...register("inStock", { required: "InStock is required" })}>
          <option value="">Select Stock Status</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        {errors.inStock && <p className="text-danger">{errors.inStock.message}</p>}
      </div>


      {/* Action Buttons */}
      <div className="text-center mt-4">
        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary me-2">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {modalMode === "add" ? "Add Product" : "Update Product"}
        </button>
      </div>
    </form>
  </div>
</div>

    
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
       
        <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 transition-all" 
            role="dialog" 
            aria-modal="true"
            onKeyDown={(e) => e.key === "Escape" && setIsDeleteModalOpen(false)}
          >
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Delete Product</h2>
          <p className="mb-6">
            Are you sure you want to delete "<strong>{selectedProduct?.productName}</strong>"? This action cannot be undone.
          </p>
              <div className="flex justify-end space-x-3">
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

export default ProductManagement;