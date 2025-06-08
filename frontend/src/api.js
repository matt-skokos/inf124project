import axios from 'axios';
import { auth } from './firebase';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Automatically attach a fresh Firebase ID token to every outgoing request
API.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    // refresh if expired, otherwise return cached token
    const freshToken = await user.getIdToken(/* forceRefresh= */ false);
    config.headers.Authorization = `Bearer ${freshToken}`;
    // keep localStorage in sync (optional)
    localStorage.setItem('ID_TOKEN', freshToken);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
