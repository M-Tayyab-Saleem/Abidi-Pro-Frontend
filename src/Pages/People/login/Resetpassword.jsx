import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // watch to keep track of password
  } = useForm();

  // Password regex for validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle form submission
  const onSubmit = (data) => {};

  const navigate = useNavigate();
  const handleclick = () => {
    if (
      watch("password") === watch("confirmPassword") &&
      watch("password") !== "" &&
      watch("confirmPassword") !== "" &&
      watch("password").length >= 8 &&
      watch("confirmPassword").length >= 8 &&
      passwordRegex.test(watch("password")) &&
      passwordRegex.test(watch("confirmPassword"))
    ) {
      navigate("/login");
    } else {
      toast.error("Please fill in all fields.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

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

        {/* Password Field */}
        <div className="relative w-full mb-4">
          <label htmlFor="password" className="block text-white mb-1">
            Password:
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: passwordRegex,
                message:
                  "Password must be at least 8 characters, contain at least one uppercase letter, one number, and one special character.",
              },
            })}
            className="w-full p-2 pr-10 rounded bg-gray-300"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-3">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative w-full mb-4">
          <label htmlFor="confirmPassword" className="block text-white mb-1">
            Confirm Password:
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="w-full p-2 pr-10 rounded bg-gray-300"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-3">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleclick}
          type="submit"
          className="w-full bg-orange-400 py-2 rounded text-black"
        >
          Reset Password
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
