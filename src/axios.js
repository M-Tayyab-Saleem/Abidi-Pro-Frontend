import axios from 'axios';
 
// Create Axios instance
const api = axios.create({
  baseURL: 'https://backend-p6ep.onrender.com/api/web',
  withCredentials: true,  
});
 
export default api;
 