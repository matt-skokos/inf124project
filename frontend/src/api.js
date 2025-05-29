import axios from 'axios'; 

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
}); 

// Automatically attach your Firebase ID token to every outgoing request
// no need to manually set headers in every component. (middleware for every request)
API.interceptors.request.use(config => {
    const token = localStorage.getItem('ID_TOKEN'); 
    if (token){
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
}); 

export default API;