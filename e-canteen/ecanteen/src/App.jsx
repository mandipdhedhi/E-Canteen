import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css'
import { Homepage } from './components/Homepage'
import { Route, Routes,useLocation } from 'react-router-dom';
import { Loginpage } from './components/Loginpage';
import { Registerpage } from './components/Registerpage';
import { ForgotPassword } from './components/ForgotPassword';
import axios from 'axios';
import { UserNavbar } from './components/layouts/UserNavbar';
import { UserSidebar } from './components/layouts/UserSidebar';

import { AddAddress } from './components/user/AddAddress'; 
import PrivateRoutes from './components/hooks/PrivateRoutes';
import AdminNavbar from './components/admin/AdminNavbar';
import AdminPanel from './components/AdminPanel';
import { User } from './components/admin/User';
import { UserAddress } from './components/admin/UserAddress';

import Dashboard from './components/admin/Dashboard';
import CategoryManagement from './components/admin/CategoryManagement';
import Settings from './components/admin/Settings';
import ReviewsManagement from './components/admin/ReviewsManagement';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import ReportsAnalytics from './components/admin/ReportsAnalytics';

// Import customer panel pages
import HomePage from './components/user/HomePage';
import ProductsPage from './components/user/ProductsPage';
import ProductDetailPage from './components/user/ProductDetailPage';
import CartPage from './components/user/CartPage';
import WishlistPage from './components/user/WishlistPage';
import CheckoutPage from './components/user/CheckoutPage';
import OrderHistoryPage from './components/user/OrderHistoryPage';
import ProfilePage from './components/user/ProfilePage';
import AddressManagementPage from './components/user/AddressManagementPage';
import ReviewsPage from './components/user/ReviewsPage';
import ProductList from './components/admin/ProductList';
import AddAdmin from './components/admin/AddAdmin';
import Navbar from './components/common/Navbar';
import { Logout } from './components/Logout';
import CityManagement from './components/admin/CityManagement';
import { UserPrivateRoute } from './components/hooks/UserPrivateRoute';
import { ResetPassword } from './components/ResetPassword';

function App() {
    //  axios.defaults.baseURL="http://localhost:3001"
     axios.defaults.baseURL="https://e-canteen.onrender.com"
     
     const location = useLocation();

     useEffect(() => {

      const body = document.querySelector('body');
      if(location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot" || location.pathname === "/resetpassword/:token") {
       
        if(!body.classList.contains('signup-singin-page')) {
          body.classList.add('signup-singin-page');
        } 
      }
      else {
        if(body.classList.contains('signup-singin-page')) {
          body.classList.remove('signup-singin-page');
        }
      }
      //  console.log("URL changed to:", location.pathname);
     }, [location.pathname]); // Runs whenever URL changes
  
  return (


    <div className={`${location.pathname === "/" ? "home-background" : ""} `}>
      {/* <Homepage></Homepage> */}
      <Routes>

        <Route path='/login' element={<Loginpage/>}></Route>
        <Route path='/register' element={<Registerpage/>}></Route>
        <Route path='/forgot' element={<ForgotPassword/>}></Route>
        <Route path='/resetpassword/:token' element={<ResetPassword/>}/>
        <Route path='/' element={<Homepage/>}></Route>
        <Route path='/user/logout' element={<Logout/>}/>

        {/* <Route path="/" element={<PrivateRoutes />}>  */}
          <Route path='/' element={<UserPrivateRoute/>}> 

            <Route path='/user' element={<UserNavbar/>}>
           {/* <Route path='/user' element={<Navbar/>}> */}

            <Route index element={<HomePage />} />
           
            <Route path='home' element={<HomePage />} />
            <Route path='products' element={<ProductsPage />} />
            <Route path='products/:productId' element={<ProductDetailPage />} />
            <Route path='cart' element={<CartPage />} />
            <Route path='wishlist' element={<WishlistPage />} />
            <Route path='checkout' element={<CheckoutPage />} />
            <Route path='orders' element={<OrderHistoryPage />} />
            <Route path='profile' element={<ProfilePage />} />
            <Route path='addresses' element={<AddressManagementPage />} />
            <Route path='add-address' element={<AddAddress />} />
            <Route path='reviews' element={<ReviewsPage />} />
            <Route path='reviews/add' element={<ReviewsPage />} />
            <Route path='reviews/add/:orderId' element={<ReviewsPage />} />
            </Route>

          </Route>

          <Route path="/" element={<PrivateRoutes />}>

             <Route path='/admin' element={<AdminPanel/>}>
          <Route index element={<Dashboard/>} />
          <Route path='logout' element={<Logout/>}/>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='userdata' element={<User/>}/>
            <Route path='useraddress' element={<UserAddress/>}/>
            <Route path='category' element={<CategoryManagement/>}/>
            <Route path='product' element={<ProductList/>}/>
            <Route path='productmanage' element={<ProductManagement/>}/>
            <Route path='order' element={<OrderManagement/>}/>
            <Route path='review' element={<ReviewsManagement/>}/>
            <Route path='reports' element={<ReportsAnalytics/>}/>
            <Route path='settings' element={<Settings/>}/>
            <Route path='addadmin' element={<AddAdmin/>}/>
            <Route path='city' element={<CityManagement/>}/>
             </Route>

          </Route>   
        {/* </Route>  */}
      </Routes>
    </div>
   
    
      
      
      
    
  )
}

export default App
