import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";

const UserLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <UserNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`bg-gray-800 text-white w-64 min-h-screen fixed top-16 left-0 transition-all duration-300 z-10 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Customer Panel</h2>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/user/home"
                    className={`block p-2 rounded ${
                      isActive("/user/home") ? "bg-blue-600" : "hover:bg-gray-700"
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/products"
                    className={`block p-2 rounded ${
                      isActive("/user/products") ? "bg-blue-600" : "hover:bg-gray-700"
                    }`}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/cart"
                    className={`block p-2 rounded ${
                      isActive("/user/cart") ? "bg-blue-600" : "hover:bg-gray-700"
                    }`}
                  >
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/wishlist"
                    className={`block p-2 rounded ${
                      isActive("/user/wishlist") ? "bg-blue-600" : "hover:bg-gray-700"
                    }`}
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/orders"
                    className={`block p-2 rounded ${
                      isActive("/user/orders") ? "bg-blue-600" : "hover:bg-gray-700"
                    }`}
                  >
                    Order History
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/profile"
                    className={`block p-2 rounded ${
                      isActive("/user/profile") ? "bg-blue-600" : "hover:bg-gray-700"
                    }`}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/addresses"
                    className={`block p-2 rounded ${
                      isActive("/user/addresses") ? "bg-blue-600" : "hover:bg-gray-700"
                    }`}
                  >
                    Addresses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/reviews"
                    className={`block p-2 rounded ${
                      isActive("/user/reviews") ? "bg-blue-600" : "hover:bg-gray-700"
                    }`}
                  >
                    My Reviews
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout; 