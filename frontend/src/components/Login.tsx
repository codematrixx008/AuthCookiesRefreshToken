import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../store/authSlice";
import { log } from "console";

const API_BASE_URL = "http://localhost:5280/api/Auth";

const AuthComponent: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/login`,
                { username, password },
                { withCredentials: true }
            );
            dispatch(setAccessToken(response.data.accessToken));
            navigate("/profile");
            handleRefreshAndGetAccessToken();
        } catch (error) {
            setMessage("Login failed");
        }
    };

    const handleRefreshAndGetAccessToken = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/refresh`,
                {},
                { withCredentials: true }
            );
            // setMessage(response.data.message);
            console.log("Access Token on Login when refresh and get token", response.data.accessToken);
            dispatch(setAccessToken(response.data.accessToken));
        } catch (error) {
            setMessage("Failed to refresh token");
        }
    };

    useEffect(() => {
        const handleRefreshToken = async () => {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/refresh`,
                    {},
                    { withCredentials: true }
                );
            } catch (error) {
                setMessage("Failed to refresh token");
            }
        };

        const interval = setInterval(() => {
            handleRefreshToken();
        }, 5 * 60 * 1000); // Refresh token every 5 minutes
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: "350px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary w-100" onClick={handleLogin}>
                    Login
                </button>
                {message && <p className="text-danger mt-2 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default AuthComponent;