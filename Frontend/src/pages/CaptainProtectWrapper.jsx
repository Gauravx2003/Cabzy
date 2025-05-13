import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainProtectWrapper = ({children}) => {
   
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { captainData, setCaptainData } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/captain-login");
        }
    }, [token, navigate]);

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/captains/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status !== 200) {
            setCaptainData(response.data.captain);
            setIsLoading(false);
            navigate("/captain-login");
        }
    }).catch((error) => {
        console.error("Error fetching captain profile:", error);
        localStorage.removeItem("token");
        navigate("/captain-login");
    });

    return (
        <>
            {children}
        </>
    );
} 

export default CaptainProtectWrapper