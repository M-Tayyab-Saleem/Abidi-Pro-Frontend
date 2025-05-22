import axios from 'axios';
 
// Create Axios instance
const api = axios.create({
  baseURL: 'https://abidi-pro-git-main-m-tayyab-saleems-projects.vercel.app/api/web',
  withCredentials: true,  
});
 
export default api;
 