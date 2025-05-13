import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1a2a2f] to-[#274744] px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-lg p-10 max-w-md w-full text-white text-center border border-white border-opacity-20">
        <h1 className="text-2xl font-semibold mb-4">Check Your Email</h1>
        <p className="text-sm text-gray-200 mb-6">
          A password reset link has been sent to your registered email address.
        </p>

        {/* Button container */}
        <div className="flex justify-center gap-6 mt-4">
          <Link to="/login" className="text-blue-300 hover:underline">
            Back to Login
          </Link>

          <Link to="/reset-password" className="text-blue-300 hover:underline">
            If Successful
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

