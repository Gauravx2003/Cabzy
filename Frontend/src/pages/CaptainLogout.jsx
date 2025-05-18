import React from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainLogout = () => {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const {setCaptain} = React.useContext(CaptainDataContext);

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/captains/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }

    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem("token");
            localStorage.removeItem("captain");
            setCaptain(null);
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