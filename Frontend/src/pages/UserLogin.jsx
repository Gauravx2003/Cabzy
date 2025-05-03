import React from "react";
import { Link } from "react-router-dom";
import bg from "../images/Cabzy_bg.png";
import logo from "../images/Cabzy_logo.png";

const UserLogin = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userData, setUserData] = React.useState({});

    const submitHandler = async (e) => {
        e.preventDefault();
        setUserData({
            email: email,
            password: password
        })
        console.log(userData)
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
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-8">
                <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
                    
                    <form onSubmit={(e) => submitHandler(e)} className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-1">What's Your Email</h3>
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
                            <h3 className="text-sm font-medium text-gray-700 mb-1">Enter Password</h3>
                            <input 
                                required 
                                type="password" 
                                placeholder="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        
                        <button className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300">
                            Login
                        </button>
                    </form>
                    
                    <p className="mt-4 text-center text-sm text-gray-600">
                        New here? <Link to='/signup' className="text-blue-600 hover:text-blue-800 font-medium">Create New Account</Link>
                    </p>
                </div>
            </div>
            
            {/* Footer with Captain login */}
            <footer className="w-full py-4 border-t border-gray-200">
                <div className="text-center">
                    <Link to="/captain-login" className="text-gray-600 hover:text-blue-600 text-sm inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Sign in as Captain
                    </Link>
                </div>
            </footer>
        </div>
    );
}

export default UserLogin;