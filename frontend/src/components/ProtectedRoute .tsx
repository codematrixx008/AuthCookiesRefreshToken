import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const accessToken = localStorage.getItem("AccessToken");
    return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;