import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
    const accessToken = Cookies.get("AccessToken");
    return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;