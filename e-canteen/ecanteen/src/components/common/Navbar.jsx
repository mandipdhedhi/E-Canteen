// import React, { useState, useEffect } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [showUserMenu, setShowUserMenu] = useState(false);

//   const [userId, setUserId] = useState();

// useEffect(() => {
//   const id = localStorage.getItem("id");
//   setUserId(id);
// }, []);
// console.log(userId)

//   useEffect(() => {
//     // In production, check authentication status
//     // For now, using mock data
    
    
//     setIsLoggedIn(true);
//     setCartCount(3);
//     setWishlistCount(5);
//   }, []);
 

//   const handleLogout = async () => {
//     try {
//       // In production: await axios.post('/api/auth/logout');
//       setIsLoggedIn(false);
//       navigate('/login');
//     } catch (err) {
//       console.error('Error logging out:', err);
//     }
//   };

//   return (
//     <div>
//       <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
//       <div className="container">
//         {/* Brand Logo */}
//         <Link className="navbar-brand d-flex align-items-center" to="/">
//           <img 
//             src="/logo.png" 
//             alt="E-Canteen" 
//             height="40"
//             className="me-2"
//           />
//           <span className="fw-bold text-primary">E-Canteen</span>
//         </Link>

//         {/* Mobile Toggle Button */}
//         <button 
//           className="navbar-toggler" 
//           type="button" 
//           data-bs-toggle="collapse" 
//           data-bs-target="#navbarContent"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navbar Content */}
//         <div className="collapse navbar-collapse" id="navbarContent">
//           {/* Search Bar */}
//           <form className="d-flex mx-auto" style={{ maxWidth: '500px' }}>
//             <div className="input-group">
//               <input 
//                 type="search" 
//                 className="form-control" 
//                 placeholder="Search for food items..." 
//                 aria-label="Search"
//               />
//               <button className="btn btn-outline-primary" type="submit">
//                 <i className="bi bi-search"></i>
//               </button>
//             </div>
//           </form>

//           {/* Navigation Links */}
//           <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
//             {/* Menu Link */}
//             <li className="nav-item me-2">
//               <Link className="nav-link" to="/menu">
//                 <i className="bi bi-grid me-1"></i>
//                 Menu
//               </Link>
//             </li>

//             {isLoggedIn ? (
//               <>
//                 {/* Wishlist Button */}
//                 <li className="nav-item me-2">
//                   <Link 
// to={userId ? `/user/${userId}/wishlist` : "/login"}
//                     className="nav-link position-relative"
//                     style={{
//                       color: 'inherit',
//                       transition: 'all 0.3s ease'
//                     }}
//                     onMouseEnter={(e) => e.currentTarget.style.color = '#dc3545'}
//                     onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
//                   >
//                     <i className="bi bi-heart fs-5"></i>
//                     {wishlistCount > 0 && (
//                       <span 
//                         className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
//                         style={{ fontSize: '0.65rem' }}
//                       >
//                         {wishlistCount > 99 ? '99+' : wishlistCount}
//                       </span>
//                     )}
//                   </Link>
//                 </li>

//                 {/* Cart Button */}
//                 <li className="nav-item me-3">
//                   <Link 
//                    to={`/user/${userId}/cart`} 
//                     className="nav-link position-relative"
//                   >
//                     <i className="bi bi-cart3 fs-5"></i>
//                     {cartCount > 0 && (
//                       <span 
//                         className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
//                         style={{ fontSize: '0.65rem' }}
//                       >
//                         {cartCount > 99 ? '99+' : cartCount}
//                       </span>
//                     )}
//                   </Link>
//                 </li>

//                 {/* User Profile Dropdown */}
//                 <li className="nav-item dropdown">
//                   <button
//                     className="btn nav-link dropdown-toggle d-flex align-items-center"
//                     onClick={() => setShowUserMenu(!showUserMenu)}
//                     onBlur={() => setTimeout(() => setShowUserMenu(false), 100)}
//                   >
//                     <img
//                       src="https://via.placeholder.com/32"
//                       alt="Profile"
//                       className="rounded-circle me-2"
//                       width="32"
//                       height="32" 
//                     />
//                     <span className="d-none d-lg-inline">My Account</span>
//                   </button>
//                   <ul className={`dropdown-menu dropdown-menu-end shadow-sm ${showUserMenu ? 'show' : ''}`}>
//                     <li>
//                       <Link className="dropdown-item" to="/user/profile">
//                         <i className="bi bi-person me-2"></i>
//                         Profile
//                       </Link>
//                     </li>
//                     <li>
//                       <Link className="dropdown-item" to="/user/orders">
//                         <i className="bi bi-box me-2"></i>
//                         Orders
//                       </Link>
//                     </li>
//                     <li>
//                       <Link className="dropdown-item" to="/user/addresses">
//                         <i className="bi bi-geo-alt me-2"></i>
//                         Addresses
//                       </Link>
//                     </li>
//                     <li>
//                       <Link className="dropdown-item" to="/user/reviews">
//                         <i className="bi bi-star me-2"></i>
//                         Reviews
//                       </Link>
//                     </li>
//                     <li><hr className="dropdown-divider" /></li>
//                     <li>
//                       <button 
//                         className="dropdown-item text-danger" 
//                         onClick={handleLogout}
//                       >
//                         <i className="bi bi-box-arrow-right me-2"></i>
//                         Logout
//                       </button>
//                     </li>
//                   </ul>
//                 </li>
//               </>
//             ) : (
//               <>
//                 {/* Login/Register Buttons */}
//                 <li className="nav-item me-2">
//                   <Link 
//                     to="/login" 
//                     className="btn btn-outline-primary"
//                   >
//                     Login
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link 
//                     to="/register" 
//                     className="btn btn-primary"
//                   >
//                     Register
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
      
//     </nav>
//     <main className="container py-4">
//         <Outlet/>
//       </main>

//        {/* Footer */}
//             <footer className="bg-light py-4 mt-auto">
//               <div className="container">
//                 <div className="row">
//                   <div className="col-md-4">
//                     <h5>E-Canteen</h5>
//                     <p className="text-muted">Delicious food delivered to your doorstep.</p>
//                   </div>
//                   <div className="col-md-4">
//                     <h5>Quick Links</h5>
//                     <ul className="list-unstyled">
//                       <li><Link to="/user/home" className="text-decoration-none">Home</Link></li>
//                       <li><Link to="/user/products" className="text-decoration-none">Products</Link></li>
//                       <li><Link to="/user/cart" className="text-decoration-none">Cart</Link></li>
//                       <li><Link to="/user/profile" className="text-decoration-none">Profile</Link></li>
//                     </ul>
//                   </div>
//                   <div className="col-md-4">
//                     <h5>Contact Us</h5>
//                     <address className="text-muted">
//                       <p>123 Main Street</p>
//                       <p>Bhavnagar,Gujarat 364145</p>
//                       <p>Email: ecanteen@gmail.com</p>
//                       <p>Phone:9624640966</p>
//                     </address>
//                   </div>
//                 </div>
//                 <div className="row mt-3">
//                   <div className="col-12 text-center">
//                     <p className="text-muted mb-0">© 2025 E-Canteen. All rights reserved.</p>
//                   </div>
//                 </div>
//               </div>
//             </footer>
//     </div>
    
//   );
// };

// export default Navbar; 