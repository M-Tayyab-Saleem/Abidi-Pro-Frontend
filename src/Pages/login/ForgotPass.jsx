import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  return (
    // <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1a2a2f] to-[#274744] px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-lg p-10 max-w-md w-full text-white text-center border border-white border-opacity-20 flex">
                <div className="">
                    <h1 className="text-2xl font-semibold mb-4">Check Your Email</h1>
                        <p className="text-sm text-gray-200 mb-6">
                        A password reset link has been sent to your registered email address.
                        
                        </p>

                        <Link to="/auth/login" className="text-blue-300 hover:underline text-center block mt-4">
                                
                                Back to Login
                        </Link>
                </div>
        
 
                <div className="text-blue-300 hover:underline text-center block mt-4">
                <button>
                    <Link to="/reset-password" className="text-blue-300 hover:underline text-center block mt-4">
                    <h5>if successful</h5>
                    </Link>
                </button>
                </div>
            
            </div>

        
    // </div>
  );
};

export default ForgotPasswordPage;


