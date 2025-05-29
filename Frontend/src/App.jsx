import React, {useContext} from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import UserSignup from "./pages/UserSignup";
import Home from "./pages/home";
import  UserContext, { UserDataContext } from "./context/UserContext";
import './style.css';
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import CapHome from "./pages/capHome";
import CaptainLogout from "./pages/CaptainLogout";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";

const App = () => {

     const user = useContext(UserDataContext);
     //console.log(user);
     
  return (
    
    <div>
        <Routes>
            <Route path="/" element={<Start/>} />
            <Route path="/login" element={<UserLogin/>} />
            <Route path="/captain-login" element={<CaptainLogin/>} />
            <Route path="/captain-signup" element={<CaptainSignup/>} />
            <Route path="/signup" element={<UserSignup/>} />
            <Route path="/riding" element={<Riding />} />
            <Route path="/captain-riding" element={<CaptainRiding />} />
             <Route path="/captain-home" element={
              <CaptainProtectWrapper>
                <CapHome/>
              </CaptainProtectWrapper>
            } />
          
            <Route path="/home" element={
              <UserProtectWrapper>
                <Home/>
              </UserProtectWrapper>
            } />

            <Route path="/user/logout" element={
              <UserProtectWrapper>
                <UserLogout/>
              </UserProtectWrapper>
            } />
            <Route path="/captain/logout" element={
              <UserProtectWrapper>
                <CaptainLogout/>
              </UserProtectWrapper>
            } />
        </Routes>
    </div>
   
  );
}

export default App;