import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/Cabzy_logo.png";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userData, setUserData] = React.useState({});

    const navigate = useNavigate();
    const {user, setUser} = React.useContext(UserDataContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        const newUser = {
            fullname: {
                firstname: firstName,   
                lastname: lastName
            },  
            email: email,
            password: password
        }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`, newUser);

        if(response.status === 201) {
            const data = response.data;
            setUser(data.user);
            localStorage.setItem('token', data.token);
            navigate('/home');

        }

        
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    }

    

    return (
        <div className="min-h-screen min-w-screen bg-gray-50 flex flex-col">
            {/* Header with logo */}
            <header className="p-6 flex items-center justify-center md:justify-start">
                <div className="bg-white rounded-full p-3 shadow-md">
                    <img className="w-12 h-12 object-contain" src={logo} alt="Cabzy logo" />
                </div>
                <h1 className="ml-3 text-2xl font-bold text-gray-800">Cabzy</h1>
            </header>
            
            {/* Main content */}
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-1">
                <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
                    
                    <form onSubmit={(e) => submitHandler(e)} className="space-y-6">
                        {/* First name and Last name in a row */}
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <h3 className="text-sm font-medium text-gray-700 mb-1">First Name</h3>
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="John" 
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                                />
                            </div>
                            <div className="w-1/2">
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Last Name</h3>
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="Doe" 
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Email Address</h3>
                            <input 
                                required 
                                type="email" 
                                placeholder="example@abc.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Password</h3>
                            <input 
                                required 
                                type="password" 
                                placeholder="Create password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        
                        <button className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300">
                            Sign Up
                        </button>
                    </form>
                    
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account? <Link to='/login' className="text-blue-600 hover:text-blue-800 font-medium">Login</Link>
                    </p>
                </div>
            </div>
            
            {/* Footer with terms and conditions */}
            <footer className="w-full py-4 border-t border-gray-200">
                <div className="text-center px-6">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to Cabzy's <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default UserSignup;