import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserLogout = () => {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const {setUser} = React.useContext(UserDataContext);

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }

    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            navigate("/login");
        }
    })

    return (
        <div>
            <h1>Logout</h1>
            <p>You have been logged out successfully.</p>
            <p>Click <a href="/login">here</a> to login again.</p>
        </div>
    );
}   

export default UserLogout;