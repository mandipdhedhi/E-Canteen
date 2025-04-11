import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";


    const useAuth = () => {
    const [authState, setauthState] = useState({isLoggedin:false,role:""});
    const [loading, setloading] = useState(true)

    useEffect(()=>{
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role");
          console.log(id,role)
        if(id){
            setauthState({isLoggedin:true,role:role})
        }
        console.log(authState)
        setloading(false);
    },[])
    return { ...authState, loading };
}


const PrivateRoutes = () => {
    const auth = useAuth();
  
    if (auth.loading) {
      return <h1>Loading...</h1>; // Prevents redirection before auth state is set
    }
  
    return auth.isLoggedin && auth.role=="admin" ? <Outlet /> : <Navigate to="/login" />;
  };

  export default PrivateRoutes;
  