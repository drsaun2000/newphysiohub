import axios from "axios";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;
import Cookies from "js-cookie";

const api = axios.create({
    baseURL : api_url,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      withCredentials: true,
})

api.interceptors.request.use((config)=>{
  
    const accessToken = localStorage.getItem("token")
   

    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config
},
(error) => {
  return Promise.reject(error);
})

export default api