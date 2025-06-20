import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const UserProtectWrapper = ({children}) => {
   
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { user, setUserData } = useContext(UserDataContext);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status !== 200) {
            console.log(response.data);
            setUserData(response.data.user);
            setIsLoading(false);
            navigate("/login");
        }
    }).catch((error) => {
        console.error("Error fetching User profile:", error);
        localStorage.removeItem("token");
        navigate("/login");
    });

    return (
        <>
            {children}
        </>
    );
} 

export default UserProtectWrapper;