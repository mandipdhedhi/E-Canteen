import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export const UserNavbar = () => {
  const [siteData, setSiteData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchSiteData = async () => {
      const response = await axios.get('/site/get/');
      console.log("site data",response.data.data);
      setSiteData(response.data.data);
    }
    fetchSiteData();
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Function to close mobile menu
  const closeMobileMenu = () => {
    const navbarCollapse = document.getElementById('navbarContent');
    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false
      });
      bsCollapse.hide();
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          {/* Brand */}
          <div className="navbar-brand">
            {siteData.map((item) => (
              <Link to="/user" className="text-decoration-none" key={item._id} onClick={closeMobileMenu}>
                <span className="fw-bold fs-4 text-primary">{item.siteName}</span>
              </Link>
            ))}
          </div>

          {/* Toggle Button */}
          <button 
            className="navbar-toggler border-0 shadow-none" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent" 
            aria-controls="navbarContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list fs-4"></i>
          </button>

          {/* Main Navigation */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link to="/user/home" className={`nav-link px-3 ${isActiveRoute('/user/home')}`} onClick={closeMobileMenu}>
                  <i className="bi bi-house-door me-1"></i> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user/products" className={`nav-link px-3 ${isActiveRoute('/user/products')}`} onClick={closeMobileMenu}>
                  <i className="bi bi-grid me-1"></i> Products
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user/orders" className={`nav-link px-3 ${isActiveRoute('/user/orders')}`} onClick={closeMobileMenu}>
                  <i className="bi bi-box me-1"></i> My Orders
                </Link>
              </li>
            </ul>

            {/* Right Navigation */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/user/wishlist" className={`nav-link position-relative ${isActiveRoute('/user/wishlist')}`} onClick={closeMobileMenu}>
                  <i className="bi bi-heart"></i>
                  <span className="ms-1">Wishlist</span>
                </Link>
              </li>

              <li className="nav-item ms-3">
                <Link to="/user/cart" className={`nav-link position-relative ${isActiveRoute('/user/cart')}`} onClick={closeMobileMenu}>
                  <i className="bi bi-cart3"></i>
                  <span className="ms-1">Cart</span>
                </Link>
              </li>

              <li className="nav-item dropdown ms-3">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle me-1"></i>
                  Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                  <li>
                    <Link to="/user/profile" className="dropdown-item py-2" onClick={closeMobileMenu}>
                      <i className="bi bi-person me-2"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/addresses" className="dropdown-item py-2" onClick={closeMobileMenu}>
                      <i className="bi bi-geo-alt me-2"></i> Addresses
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/reviews" className="dropdown-item py-2" onClick={closeMobileMenu}>
                      <i className="bi bi-star me-2"></i> Reviews
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link to="/user/logout" className="dropdown-item py-2 text-danger" onClick={closeMobileMenu}>
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 bg-light py-4">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-5 border-top">
        <div className="container">
          {siteData.map((item) => (
            <div className="row g-4" key={item._id}>
              <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                <h5 className="fw-bold mb-3 text-primary">{item.siteName}</h5>
                <p className="text-muted mb-0 pe-xl-5">{item.description}</p>
              </div>
              <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                <h5 className="fw-bold mb-3 text-primary">Quick Links</h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <Link to="/user/home" className="text-decoration-none text-muted hover-primary d-inline-flex align-items-center" onClick={closeMobileMenu}>
                      <i className="bi bi-chevron-right me-2 small"></i> Home
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/user/products" className="text-decoration-none text-muted hover-primary d-inline-flex align-items-center" onClick={closeMobileMenu}>
                      <i className="bi bi-chevron-right me-2 small"></i> Products
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/user/cart" className="text-decoration-none text-muted hover-primary d-inline-flex align-items-center" onClick={closeMobileMenu}>
                      <i className="bi bi-chevron-right me-2 small"></i> Cart
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/user/profile" className="text-decoration-none text-muted hover-primary d-inline-flex align-items-center" onClick={closeMobileMenu}>
                      <i className="bi bi-chevron-right me-2 small"></i> Profile
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-lg-4 col-md-6">
                <h5 className="fw-bold mb-3 text-primary">Contact Us</h5>
                <div className="text-muted">
                  <p className="mb-2 d-flex align-items-center">
                    <i className="bi bi-geo-alt me-2"></i>
                    {item.address1}
                  </p>   
                  <p className="mb-2 d-flex align-items-center">
                    <i className="bi bi-building me-2"></i>
                    {item.address2}
                  </p>
                  <p className="mb-2 d-flex align-items-center">
                    <i className="bi bi-envelope me-2"></i>
                    {item.email}
                  </p>
                  <p className="mb-0 d-flex align-items-center">
                    <i className="bi bi-telephone me-2"></i>
                    {item.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="row mt-5 pt-4 border-top">
            <div className="col-12 text-center">
              <p className="text-muted mb-0">
                © {new Date().getFullYear()} {siteData[0]?.siteName || 'E-Canteen'}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
