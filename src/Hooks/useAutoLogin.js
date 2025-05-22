import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";
import api from "../axios";
 
const useAutoLogin = () => {
  const dispatch = useDispatch();
 
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/refresh");
        dispatch(setUser(res.data.user));
      } catch (err) {
        dispatch(clearUser());
        console.log("Session expired or invalid");
      }
    };
 
    checkSession();
  }, [dispatch]);
};
 
export default useAutoLogin;
 
 