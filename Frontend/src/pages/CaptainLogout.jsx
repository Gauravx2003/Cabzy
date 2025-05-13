import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainLogout = () => {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/captains/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }

    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem("token");
            navigate("/captain-login");
        }
    })

    return (
        <div>
            <h1>Logout</h1>
            <p>You have been logged out successfully.</p>
            <p>Click <a href="/captain-login">here</a> to login again.</p>
        </div>
    );
}   

export default CaptainLogout;