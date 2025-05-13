
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Adjust the URL if needed

export const register = (userData) => {
  return axios.post(`${API_URL}register/`, userData);
};

export const login = (credentials) => {
  return axios.post(`${API_URL}login/`, credentials);
};

