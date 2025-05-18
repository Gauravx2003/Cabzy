import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/Cabzy_logo.png";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainSignup = () => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    // Vehicle information states
    const [vehicleColor, setVehicleColor] = React.useState('');
    const [vehiclePlate, setVehiclePlate] = React.useState('');
    const [vehicleCapacity, setVehicleCapacity] = React.useState('');
    const [vehicleType, setVehicleType] = React.useState('car');
    
    // const [userData, setUserData] = React.useState({});

    const navigate = useNavigate();
    const {captain, setCaptain} = React.useContext(CaptainDataContext);

    axios

    const submitHandler = async (e) => {
        e.preventDefault();
        const newCaptain = {
            fullname: {
                firstname: firstName,   
                lastname: lastName
            },  
            email: email,
            password: password,
            vehicle: {
                color: vehicleColor,
                plate: vehiclePlate,
                capacity: Number(vehicleCapacity),
                vehicleType: vehicleType
            },

            location:{
                type: "Point",
                coordinates: [73.8567, 18.5204] // Default coordinates
            }
            
        }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/captains/register`, newCaptain);
        
        if(response.status === 201) {
            const data = response.data;
            setCaptain(data.captain);
            localStorage.setItem('token', data.token);
            navigate('/captain-home');

        }

        console.log(newCaptain);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setVehicleColor('');
        setVehiclePlate('');
        setVehicleCapacity('');
        setVehicleType('');
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
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome to Our Fleet!</h2>
                    
                    <form onSubmit={(e) => submitHandler(e)} className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="mb-2">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
                            
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
                            
                            <div className="mt-4">
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
                            
                            <div className="mt-4">
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
                        </div>
                        
                        {/* Vehicle Information Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Vehicle Information</h3>
                            
                            <div className="space-y-4">
                                <div className="flex space-x-4">
                                    <div className="w-1/2">
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Vehicle Color</h3>
                                        <input 
                                            required 
                                            type="text" 
                                            placeholder="White" 
                                            value={vehicleColor}
                                            onChange={(e) => setVehicleColor(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Vehicle Plate</h3>
                                        <input 
                                            required 
                                            type="text" 
                                            placeholder="ABC-123" 
                                            value={vehiclePlate}
                                            onChange={(e) => setVehiclePlate(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex space-x-4">
                                    <div className="w-1/2">
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Vehicle Capacity</h3>
                                        <input 
                                            required 
                                            type="number" 
                                            placeholder="4" 
                                            min="1"
                                            value={vehicleCapacity}
                                            onChange={(e) => setVehicleCapacity(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Vehicle Type</h3>
                                        <select
                                            required
                                            value={vehicleType}
                                            onChange={(e) => setVehicleType(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        >
                                            <option value="car">Car</option>
                                            <option value="bike">Motorcycle</option>
                                            <option value="auto">Auto</option>
                                        </select>
                                    </div>  
                                </div>
                            </div>
                        </div>
                        
                        <button className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300">
                            Sign Up
                        </button>
                    </form>
                    
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already a Captain? <Link to='/captain-login' className="text-blue-600 hover:text-blue-800 font-medium">Login</Link>
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
    )
}

export default CaptainSignup;