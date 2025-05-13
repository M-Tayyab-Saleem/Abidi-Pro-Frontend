import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
    setShowPassword((prev)=>!prev);
    }

  const handleLogin = (e) => {
    e.preventDefault();
    // Perform auth logic here
    if (username && password) {
      // If successful login
      navigate("/people");
    } else {
       alert("Please enter valid credentials.");
    
    }
  };

  return (
    // <div className="flex items-center justify-center h-screen bg-[#274744]">
      <form onSubmit={handleLogin} className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg p-8 rounded-xl   w-96">
                    <div className="flex justify-center mb-4">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
                        alt="user"
                        className="w-16 h-16 rounded-full bg-white p-1"
                    />
                    </div>
                        <h2 className="text-white text-xl text-center pb-1">Login</h2>
                        <hr className="w-12 mx-auto pt-5 border-orange-500 " />
                        <p className="text-gray-100 text-sm text-center mb-4 pt-1">enter your credentials to log in</p>
        
                        <label className="block text-white mb-1">Username:</label>
                        <input
                        type="text"
                        className="w-full p-2 mb-4 rounded bg-gray-300"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />

                       <div className="relative w-full mb-4">
                            <label className="block text-white mb-1">Password:</label>

                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-2 pr-10 rounded bg-gray-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                                <div className="absolute right-3 top-10 text-gray-600 cursor-pointer" onClick={togglePasswordVisibility}>
                                    
                                    {showPassword ? <IoEyeOff />: <IoEye/>  }
                                </div>
    
   
  
 

                        </div>

                    <div className="flex items-center justify-between text-sm text-white mb-4">
                        <label>
                            <input type="checkbox" className="mr-1" /> Remember me
                        </label>
                        {/* <span className="text-blue-300 cursor-pointer">Forgot Password?</span> */}
                        <Link to="/auth/forgot-password" className="text-blue-300 cursor-pointer">
                            Forgot Password?
                        </Link>
                        </div>

                        <button type="submit" className="w-full bg-orange-400 py-2 rounded text-black">
                        Login
                        </button>
                    </form>
                    // </div>
  );
};

export default Login;


