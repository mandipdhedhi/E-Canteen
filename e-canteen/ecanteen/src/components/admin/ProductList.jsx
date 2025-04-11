import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/product/');
        console.log('Fetched Products:', response.data);
        
        if (response.data && response.data.data) {
          setProducts(response.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative h-48">
            <img
              src={product.productImageURL1 || product.productImageURL2 || product.productImageURL3}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
            {product.offerPercentage > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                {product.offerPercentage}% OFF
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.productName}</h3>
            
            <div className="mb-2">
              <span className="text-sm text-gray-600">Category: </span>
              <span className="font-medium">{product.categoryId?.name || 'N/A'}</span>
            </div>
            
            <div className="mb-2">
              <span className="text-sm text-gray-600">Subcategory: </span>
              <span className="font-medium">{product.subCategoryId?.name || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm text-gray-600">Price: </span>
                {product.offerPrice ? (
                  <div>
                    <span className="text-lg font-bold text-green-600">
                      ₹{product.offerPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{product.basePrice}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">₹{product.basePrice}</span>
                )}
              </div>
              <div>
                <span className="text-sm text-gray-600">Stock: </span>
                <span className="font-medium">{product.quantity}</span>
              </div>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-600">Description: </span>
              <p className="text-sm text-gray-700 line-clamp-2">{product.productDetail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 