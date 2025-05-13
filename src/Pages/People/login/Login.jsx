import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (data) => {
    if (data.username && data.password) {
      navigate("/people");
    }
  };

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return (
    <div className="flex items-center justify-center h-screen bg-[#274744]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg p-8 rounded-xl w-96"
      >
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="user"
            className="w-16 h-16 rounded-full bg-white p-1"
          />
        </div>
        <h2 className="text-white text-xl text-center pb-1">Login</h2>
        <hr className="w-12 mx-auto pt-5 border-orange-500" />
        <p className="text-gray-100 text-sm text-center mb-4 pt-1">
          enter your credentials to log in
        </p>

        {/* Username */}
        <label className="block text-white mb-1">Username:</label>
        <input
          type="text"
          className="w-full p-2 mb-1 rounded bg-gray-300"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 5,
              message: "Username must be at least 5 characters and only letters",
            },
            pattern: {
              value: /^[A-Za-z\s]+$/, // Only letters and spaces
              message: "Username can only contain letters and spaces",
            },
          })}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">{errors.username.message}</p>
        )}

        {/* Password */}
        <div className="relative w-full mb-4">
          <label className="block text-white mb-1">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 pr-10 rounded bg-gray-300"
            {...register("password", {
              pattern: {
                value: passwordRegex,
                message:
                  "Password must be at least 8 characters, contain at least one uppercase letter, one number, and one special character.",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">
              {errors.password.message}
            </p>
          )}
          <div
            className="absolute right-3 top-10 text-gray-600 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <IoEyeOff /> : <IoEye />}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-white mb-4">
          <label>
            <input type="checkbox" className="mr-1" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-blue-300 cursor-pointer">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-400 py-2 rounded text-black"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
