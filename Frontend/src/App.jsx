import React, {useContext} from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import UserLogin from "./pages/UserLogin";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import UserSignup from "./pages/UserSignup";
import { UserDataContext } from "./context/UserContext";
import './style.css';

const App = () => {

     const user = useContext(UserDataContext);
     console.log(user);
     
  return (
    
    <div>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<UserLogin/>} />
            <Route path="/captain-login" element={<CaptainLogin/>} />
            <Route path="/captain-signup" element={<CaptainSignup/>} />
            <Route path="/signup" element={<UserSignup/>} />
        </Routes>
    </div>
   
  );
}

export default App;