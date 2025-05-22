import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
 
 
const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userInfo);
 
  if (user === null) {
    return <div className="text-white text-center mt-10">Checking session...</div>;
  }
 
  return user ? <Navigate to="/people" /> : children;
};
 
 
export default PublicRoute;
 