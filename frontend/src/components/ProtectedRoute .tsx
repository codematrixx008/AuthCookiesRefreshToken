import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { setAccessToken } from "../store/authSlice";

const ProtectedRoute = () => {
    
    const accessToken = Cookies.get("AccessToken");
    console.log("Access token on protectedRoute", accessToken);
    return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;