// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.100:8000/api',  
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/login/', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (fullName, username, email, password) => {
  try {
    const response = await api.post('/register/', { fullName, username, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

