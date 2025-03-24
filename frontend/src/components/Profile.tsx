import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const API_URL = "http://localhost:5280/api/Auth";

const Profile = () => {
    const navigate = useNavigate();
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);


    useEffect(() => {
        if (!localStorage.getItem("AccessToken")) {
            navigate("/login");
        }
    }, [navigate]);
    console.log("accessToken", accessToken);




    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

            document.cookie = "RefreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            localStorage.removeItem("AccessToken");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row d-flex flex-nowrap align-items-center">
                <div className="col-md-6">
                    <div className="p-4">
                        <h2>Profile</h2>
                    </div>
                </div>

                <div className="col-md-6 d-flex justify-content-end">
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="text-center mt-3">
                <div style={{ maxWidth:'100%', wordBreak: 'break-word' }}>
                    <strong>Access Token:</strong> {accessToken}
                </div>
            </div>

        </div>


    );
};

export { Profile };